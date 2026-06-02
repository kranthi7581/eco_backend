const express = require("express");
const router = express.Router();
const ordersController = require("../../controllers/USER/orders");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");

router.get("/", authmiddleware, authorize("user"), ordersController.getOrders);
router.get("/track/:id", authmiddleware, authorize("user"), ordersController.trackOrder);

module.exports = router;
