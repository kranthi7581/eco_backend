const Joi = require("joi");

const createSubcategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ""),
  categoryId: Joi.number().integer().required(),
  status: Joi.string().valid("active", "inactive").optional(),
  slug: Joi.string().optional(),
});

const updateSubcategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
  categoryId: Joi.number().integer().optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  slug: Joi.string().optional(),
});

module.exports = { createSubcategorySchema, updateSubcategorySchema };
