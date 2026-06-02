const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/ADMIN/products");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const upload = require("../../middelware/upload.middleware");
const validate = require("../../validators/validate");
const productValidator = require("../../validators/product.validator");

router.post(
  "/",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(productValidator.createProductSchema),
  productsController.createProduct,
);
router.get(
  "/",
  authmiddleware,
  authorize("admin", "user"),
  productsController.getAllProducts,
);
router.get(
  "/:id",
  authmiddleware,
  authorize("admin", "user"),
  productsController.getProductById,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(productValidator.updateProductSchema),
  productsController.updateProduct,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin"),
  productsController.deleteProduct,
);

module.exports = router;
