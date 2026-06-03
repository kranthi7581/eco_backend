const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/ADMIN/categories");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");
const upload = require("../../middelware/upload.middleware");
const validate = require("../../validators/validate");
const categoryValidator = require("../../validators/category.validator");

router.post(
  "/",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(categoryValidator.createCategorySchema),
  categoryController.createCategory,
);
router.get(
  "/",
  categoryController.getAllCategories,
);
router.get(
  "/:id",
  categoryController.getCategoryById,
);
router.put(
  "/:id",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(categoryValidator.updateCategorySchema),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  authmiddleware,
  authorize("admin"),
  categoryController.deleteCategory,
);

module.exports = router;
