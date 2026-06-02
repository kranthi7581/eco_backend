const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.number().integer().required(),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = { addToCartSchema, updateCartItemSchema };
