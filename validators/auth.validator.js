const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "user").default("user"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().allow("", null),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("admin", "user").optional(),
  is_active: Joi.boolean().optional(),
});

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional().allow("", null),
  role: Joi.string().valid("admin", "user").optional().default("user"),
  is_active: Joi.boolean().optional().default(true),
});

module.exports = { registerSchema, loginSchema, updateUserSchema, createUserSchema };
