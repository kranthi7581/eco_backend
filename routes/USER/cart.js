const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/USER/cart");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const cartValidator = require("../../validators/cart.validator");

// Add item to cart
router.post(
  "/add/:id",
  authmiddleware,
  authorize("user"),
  cartController.addToCart,
);
// Get user's cart
router.get("/", authmiddleware, authorize("user"), cartController.getCart);
// Remove item from cart
router.delete(
  "/remove/:id",
  authmiddleware,
  authorize("user"),
  cartController.removeFromCart,
);
// Update cart item quantity
router.put(
  "/update/:id",
  authmiddleware,
  authorize("user"),
  validate(cartValidator.updateCartItemSchema),
  cartController.updateCartItem,
);

module.exports = router;
