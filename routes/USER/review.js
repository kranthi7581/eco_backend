const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/USER/review");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const reviewValidator = require("../../validators/review.validator");

router.post(
  "/",
  authmiddleware,
  authorize("user"),
  validate(reviewValidator.createReviewSchema),
  reviewController.createReview,
);
router.get(
  "/product/:productId",
  reviewController.getReviewsByProduct,
);
router.get(
  "/user",
  authmiddleware,
  authorize("user"),
  reviewController.getUserReviews,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("user"),
  validate(reviewValidator.updateReviewSchema),
  reviewController.updateReview,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("user"),
  reviewController.deleteReview,
);

module.exports = router;
