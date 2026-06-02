const Joi = require("joi");

const createReviewSchema = Joi.object({
  productId: Joi.number().integer().required(),
  orderId: Joi.number().integer().optional(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional().allow(null, ""),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().optional().allow(null, ""),
});

module.exports = { createReviewSchema, updateReviewSchema };
