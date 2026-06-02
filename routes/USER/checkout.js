const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/USER/checkout");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const checkoutValidator = require("../../validators/checkout.validator");

router.post(
  "/",
  authmiddleware,
  authorize("user"),
  validate(checkoutValidator.checkoutSchema),
  checkoutController.checkout,
);

module.exports = router;
