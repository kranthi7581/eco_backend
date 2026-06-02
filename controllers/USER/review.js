const { Review, orders, orderItems, User } = require("../../models/relations");

const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, orderId, rating, comment } = req.body;

    let resolvedOrderId = orderId;

    if (!resolvedOrderId) {
      // Automatically look up the user's latest order containing this product
      const userOrderItem = await orderItems.findOne({
        include: [
          {
            model: orders,
            where: { userId },
            required: true,
          },
        ],
        where: { productId },
        order: [["createdAt", "DESC"]],
      });

      if (!userOrderItem) {
        return res
          .status(400)
          .json({ message: "You must purchase this product before writing a review." });
      }
      resolvedOrderId = userOrderItem.orderId;
    } else {
      // Validate the provided order ID
      const order = await orders.findOne({ where: { id: resolvedOrderId, userId } });
      if (!order) {
        return res
          .status(400)
          .json({ message: "Invalid order or order does not belong to user" });
      }

      const itemOrdered = await orderItems.findOne({ where: { orderId: resolvedOrderId, productId } });
      if (!itemOrdered) {
        return res
          .status(400)
          .json({ message: "You cannot review a product you did not purchase in this order" });
      }
    }

    const existingReview = await Review.findOne({
      where: {
        userId,
        productId,
        orderId: resolvedOrderId,
      },
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Review already exists for this order and product" });
    }

    const review = await Review.create({
      userId,
      productId,
      orderId: resolvedOrderId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching product reviews",
        error: error.message,
      });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findAll({ where: { userId } });
    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user reviews", error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ where: { id, userId } });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const review = await Review.findOne({ where: { id, userId } });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await review.destroy();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getUserReviews,
  updateReview,
  deleteReview,
};
