const Joi = require("joi");

const checkoutSchema = Joi.object({
  address: Joi.string().required(),
  couponCode: Joi.string().optional().allow(null, ""),
});

module.exports = { checkoutSchema };
