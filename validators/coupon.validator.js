const Joi = require("joi");

const createCouponSchema = Joi.object({
  code: Joi.string().required(),
  discountType: Joi.string().valid("percentage", "fixed").required(),
  discountValue: Joi.number().positive().required(),
  minOrderAmount: Joi.number().min(0).optional().default(0),
  maxDiscount: Joi.number().min(0).optional().allow(null),
  expiryDate: Joi.date().required(),
  usageLimit: Joi.number().integer().min(1).optional().default(1),
  isActive: Joi.boolean().optional().default(true),
});

const updateCouponSchema = Joi.object({
  code: Joi.string().optional(),
  discountType: Joi.string().valid("percentage", "fixed").optional(),
  discountValue: Joi.number().positive().optional(),
  minOrderAmount: Joi.number().min(0).optional(),
  maxDiscount: Joi.number().min(0).optional().allow(null),
  expiryDate: Joi.date().optional(),
  usageLimit: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
});

const applyCouponSchema = Joi.object({
  code: Joi.string().required(),
  totalAmount: Joi.number().positive().required(),
});

module.exports = { createCouponSchema, updateCouponSchema, applyCouponSchema };
