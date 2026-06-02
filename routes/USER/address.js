const express = require("express");
const router = express.Router();
const addressController = require("../../controllers/USER/address");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const validate = require("../../validators/validate");
const addressValidator = require("../../validators/address.validator");

router.post(
  "/",
  authmiddleware,
  authorize("admin", "user"),
  validate(addressValidator.createAddressSchema),
  addressController.createAddress,
);
router.get(
  "/",
  authmiddleware,
  authorize("admin", "user"),
  addressController.getAddresses,
);
router.get(
  "/:id",
  authmiddleware,
  authorize("admin", "user"),
  addressController.getAddressById,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("admin", "user"),
  validate(addressValidator.updateAddressSchema),
  addressController.updateAddress,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin", "user"),
  addressController.deleteAddress,
);

module.exports = router;
