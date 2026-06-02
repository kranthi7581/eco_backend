const razorpay = require("../../config/razorpay");
const { payment, orders, User } = require("../../models/relations");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    await payment.create({
      razorpayOrderId: order.id,
      amount,
      orderId,
      status: "pending",
    });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature === razorpaySignature) {
      await payment.update(
        {
          razorpayPaymentId,
          status: "completed",
        },
        {
          where: {
            razorpayOrderId,
          },
        },
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const allPayments = await payment.findAll({
      include: {
        model: orders,
        include: {
          model: User,
          attributes: ["id", "username", "email"],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, payments: allPayments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const pay = await payment.findByPk(id);
    if (!pay) {
      return res.status(404).json({ message: "Payment not found" });
    }
    await pay.destroy();
    res.status(200).json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getAllPayments, deletePayment };
