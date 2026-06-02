const Joi = require("joi");

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "packing", "shipping", "delivered", "completed", "cancelled").required(),
});

module.exports = { updateOrderStatusSchema };
