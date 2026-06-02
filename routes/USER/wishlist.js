const express = require("express");
const router = express.Router();
const wishlistController = require("../../controllers/USER/wishlist");
const authmiddleware = require("../../middelware/auth.middleware");
const authorize = require("../../middelware/authorize.middleware");


// Add item to wishlist
router.post("/add/:id", authmiddleware, authorize("user"), wishlistController.addToWishlist);
// Get user's wishlist
router.get("/", authmiddleware, authorize("user"), wishlistController.getWishlist);
// Remove item from wishlist
router.delete("/remove/:id", authmiddleware, authorize("user"), wishlistController.removeFromWishlist);

module.exports = router;
