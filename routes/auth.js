const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth");
const sendEmailcontroller = require("../controllers/sendemail.controller");
const authmiddleware = require("../middelware/auth.middleware");
const authorize = require("../middelware/authorize.middleware");
const upload = require("../middelware/upload.middleware");
const validate = require("../validators/validate");
const authValidator = require("../validators/auth.validator");

router.post(
  "/register",
  validate(authValidator.registerSchema),
  authcontroller.registerUser,
);
router.post(
  "/login",
  validate(authValidator.loginSchema),
  authcontroller.loginUser,
);
router.post("/logout", authcontroller.logoutUser);
router.post("/refresh-token", authcontroller.refreshToken);

router.get(
  "/all-users",
  authmiddleware,
  authorize("admin"),
  authcontroller.getAllUsers,
);
router.post(
  "/user",
  authmiddleware,
  authorize("admin"),
  upload.uploadSingle("image"),
  validate(authValidator.createUserSchema),
  authcontroller.createUser,
);
router.get(
  "/user/:id",
  authmiddleware,
  authorize("admin"),
  authcontroller.getUserById,
);
router.put(
  "/user/:id",
  authmiddleware,
  authorize("admin", "user"),
  upload.uploadSingle("image"),
  validate(authValidator.updateUserSchema),
  authcontroller.updateUser,
);
router.delete(
  "/user/:id",
  authmiddleware,
  authorize("admin"),
  authcontroller.deleteUser,
);

router.post("/forgot-password", sendEmailcontroller.sendemail);
router.post("/verify-otp", sendEmailcontroller.verifyOTP);
router.post("/reset-password", sendEmailcontroller.restpassword);

module.exports = router;
