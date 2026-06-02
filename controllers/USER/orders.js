const {orders, orderItems, products} = require("../../models/relations");

const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const userOrders = await orders.findAll({
            where: { userId },
            include: {
                model: orderItems,
                include: {
                    model: products,
                    attributes: ["id", "name", "price"],
                },
            },
        });
        res.status(200).json({ orders: userOrders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

const trackOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orders.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Error tracking order", error });
    }
};

module.exports = {
    getOrders,
    trackOrder,
};
