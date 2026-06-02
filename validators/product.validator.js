const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ""),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).optional(),
  categoryId: Joi.number().integer().required(),
  subcategoryId: Joi.number().integer().required(),
  status: Joi.string().valid("active", "inactive").optional(),
  slug: Joi.string().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
  price: Joi.number().positive().optional(),
  quantity: Joi.number().integer().min(0).optional(),
  categoryId: Joi.number().integer().optional(),
  subcategoryId: Joi.number().integer().optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  slug: Joi.string().optional(),
});

module.exports = { createProductSchema, updateProductSchema };
