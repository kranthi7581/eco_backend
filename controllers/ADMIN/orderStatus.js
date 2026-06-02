const { orders, User, orderItems, products } = require("../../models/relations");

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await orders.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "phone"],
        },
        {
          model: orderItems,
          include: {
            model: products,
            attributes: ["id", "name", "price", "image"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ orders: allOrders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id || req.body.orderId;
        const { status } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order id is required" });
        }
        if (!["pending", "packing", "shipping", "delivered", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const order = await orders.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.destroy();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

module.exports = {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
};
