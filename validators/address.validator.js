const Joi = require("joi");

const createAddressSchema = Joi.object({
  userId: Joi.number().integer().optional(),
  label: Joi.string().optional().allow(null, ""),
  line1: Joi.string().required(),
  line2: Joi.string().optional().allow(null, ""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  country: Joi.string().optional().default("India"),
});

const updateAddressSchema = Joi.object({
  label: Joi.string().optional().allow(null, ""),
  line1: Joi.string().optional(),
  line2: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().optional(),
  country: Joi.string().optional(),
});

module.exports = { createAddressSchema, updateAddressSchema };
