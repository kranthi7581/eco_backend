const { Cart, CartItem, products } = require("../../models/relations");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id || req.body.productId;
    let userCart = await Cart.findOne({ where: { userId } });
    if (!userCart) {
      userCart = await Cart.create({ userId });
    }
    const product = await products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cartItem = await CartItem.findOne({
      where: {
        cartId: userCart.id,
        productId,
      },
    });
    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.totalPrice += product.price;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: userCart.id,
        productId,
        quantity: 1,
        totalPrice: product.price,
      });
    }
    res.status(201).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error("addToCart error:", error);
    const payload =
      process.env.NODE_ENV === "production"
        ? { message: "Error adding to cart" }
        : {
            message: "Error adding to cart",
            error: error.message,
            stack: error.stack,
          };
    res.status(500).json(payload);
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
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
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res
      .status(200)
      .json({ message: "Cart fetched successfully", cart: userCart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const userCart = await Cart.findOne({ where: { userId } });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartItem = await CartItem.findOne({
      where: {
        cartId: userCart.id,
        productId,
      },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    await cartItem.destroy();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { quantity } = req.body;

    const userCart = await Cart.findOne({ where: { userId } });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cartId: userCart.id,
        productId,
      },
      include: {
        model: products,
        attributes: ["price"],
      },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.Product.price;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
};
