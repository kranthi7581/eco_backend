const express = require("express");
const router = express.Router();
const orderstatusController = require("../../controllers/ADMIN/orderStatus");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const orderStatusValidator = require("../../validators/orderStatus.validator");

router.get(
  "/",
  authmiddleware,
  authorize("admin"),
  orderstatusController.getAllOrders,
);
router.post(
  "/",
  authmiddleware,
  authorize("admin"),
  validate(orderStatusValidator.updateOrderStatusSchema),
  orderstatusController.updateOrderStatus,
);
router.post(
  "/:id",
  authmiddleware,
  authorize("admin"),
  validate(orderStatusValidator.updateOrderStatusSchema),
  orderstatusController.updateOrderStatus,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("admin"),
  validate(orderStatusValidator.updateOrderStatusSchema),
  orderstatusController.updateOrderStatus,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin"),
  orderstatusController.deleteOrder,
);

module.exports = router;
