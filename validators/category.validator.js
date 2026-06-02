const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ""),
  status: Joi.string().valid("active", "inactive").optional(),
  slug: Joi.string().required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
  status: Joi.string().valid("active", "inactive").optional(),
  slug: Joi.string().optional(),
});

module.exports = { createCategorySchema, updateCategorySchema };
