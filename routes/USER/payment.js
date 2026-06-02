const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/USER/payment");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const paymentValidator = require("../../validators/payment.validator");

router.get(
  "/key",
  authmiddleware,
  authorize("user"),
  (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  }
);

router.post(
  "/create-order",
  authmiddleware,
  authorize("user"),
  validate(paymentValidator.createOrderSchema),
  paymentController.createOrder,
);
router.post(
  "/verify-payment",
  authmiddleware,
  authorize("user"),
  validate(paymentValidator.verifyPaymentSchema),
  paymentController.verifyPayment,
);
router.get(
  "/",
  authmiddleware,
  authorize("admin"),
  paymentController.getAllPayments,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin"),
  paymentController.deletePayment,
);

module.exports = router;
