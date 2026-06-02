const express = require("express");
const router = express.Router();
const subcategoryController = require("../../controllers/ADMIN/subcategories");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const upload = require("../../middelware/upload.middleware");
const validate = require("../../validators/validate");
const subcategoryValidator = require("../../validators/subcategory.validator");

router.post(
  "/",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(subcategoryValidator.createSubcategorySchema),
  subcategoryController.createSubcategory,
);
router.get(
  "/",
  authmiddleware,
  authorize("admin", "user"),
  subcategoryController.getAllSubcategories,
);
router.get(
  "/:id",
  authmiddleware,
  authorize("admin", "user"),
  subcategoryController.getSubcategoryById,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(subcategoryValidator.updateSubcategorySchema),
  subcategoryController.updateSubcategory,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin"),
  subcategoryController.deleteSubcategory,
);

module.exports = router;
