const Joi = require("joi");

const addToWishlistSchema = Joi.object({
  productId: Joi.number().integer().required(),
});

module.exports = { addToWishlistSchema };
