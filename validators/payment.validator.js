const Joi = require("joi");

const createOrderSchema = Joi.object({
  amount: Joi.number().positive().required(),
  orderId: Joi.number().integer().required(),
});

const verifyPaymentSchema = Joi.object({
  razorpayPaymentId: Joi.string().required(),
  razorpayOrderId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
});

module.exports = { createOrderSchema, verifyPaymentSchema };
