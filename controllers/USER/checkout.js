const {
  Cart,
  CartItem,
  products,
  orders,
  orderItems,
  User,
} = require("../../models/relations");
const { sendOrderStatusEmail } = require("../../utils/emailTemplates");
const redis = require("../../config/redis");
const pusher = require("../../config/pusher");

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;
    const userCart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: {
          model: products,
          attributes: ["id", "name", "price"],
        },
      },
    });
    if (!userCart || userCart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalAmount = 0;
    for (const item of userCart.CartItems) {
      totalAmount += item.totalPrice;
      if (item.Product.quantity < item.quantity) {
        return res.status(400).json({
          message: `${item.Product.name} out of stock`,
        });
      }
    }
    const order = await orders.create({
      userId,
      totalPrice: totalAmount,
      address,
      productId: userCart.CartItems[0].productId,
    });
    for (const cartItem of userCart.CartItems) {
      await orderItems.create({
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        totalPrice: cartItem.totalPrice,
        unitPrice: cartItem.Product.price,
      });
      const orderedProduct = await products.findByPk(cartItem.productId);
      if (orderedProduct) {
        orderedProduct.quantity -= cartItem.quantity;
        await orderedProduct.save();

        // Invalidate specific product detail cache
        try {
          await redis.del(`product:${cartItem.productId}`);
          console.log(`Redis cache invalidated: product:${cartItem.productId} due to checkout`);
        } catch (cacheErr) {
          console.error("Redis error on detail invalidation during checkout:", cacheErr.message);
        }
      }
    }

    // Invalidate product catalog list cache since stock amounts changed
    try {
      await redis.del("products:all");
      console.log("Redis cache invalidated: products:all due to checkout");
    } catch (cacheErr) {
      console.error("Redis error on catalog list invalidation during checkout:", cacheErr.message);
    }

    await CartItem.destroy({ where: { cartId: userCart.id } });

    // Fetch detailed order with relations to send the notification email
    const detailedOrder = await orders.findByPk(order.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
        {
          model: orderItems,
          include: {
            model: products,
            attributes: ["id", "name", "price"],
          },
        },
      ],
    });

    if (detailedOrder && detailedOrder.User) {
      sendOrderStatusEmail(detailedOrder, detailedOrder.User).catch((err) => {
        console.error("Error sending order placement email:", err);
      });
    }

    // Trigger Pusher event for real-time admin notification
    try {
      await pusher.trigger("admin-orders", "new-order", {
        orderId: order.id,
        customerName: detailedOrder && detailedOrder.User ? detailedOrder.User.username : "Guest",
        totalAmount: order.totalPrice,
        createdAt: order.createdAt,
        order: detailedOrder, // include full order payload for real-time prepending
      });
      console.log(`[Pusher] Event 'new-order' triggered successfully for Order #${order.id}`);
    } catch (pusherErr) {
      console.error("[Pusher] Error triggering 'new-order' event:", pusherErr);
      // We catch this error so that any failure in Pusher does not disrupt the customer's checkout response.
    }

    res.status(200).json({ 
      message: "Order placed successfully", 
      orderId: order.id, 
      order 
    });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

module.exports = {
  checkout,
};
