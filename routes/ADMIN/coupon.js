const express = require("express");
const router = express.Router();
const couponController = require("../../controllers/ADMIN/coupon");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const couponValidator = require("../../validators/coupon.validator");

router.post(
  "/",
  authmiddleware,
  authorize("admin"),
  validate(couponValidator.createCouponSchema),
  couponController.createCoupon,
);
router.get(
  "/",
  couponController.getAllCoupons,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("admin"),
  validate(couponValidator.updateCouponSchema),
  couponController.updateCoupons,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin"),
  couponController.deleteCoupon,
);

router.post(
  "/apply",
  authmiddleware,
  authorize("user"),
  validate(couponValidator.applyCouponSchema),
  couponController.applyCoupon,
);

module.exports = router;
