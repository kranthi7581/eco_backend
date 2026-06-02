const { Wishlist, products } = require("../../models/relations");

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id || req.body.productId;
    const exists = await Wishlist.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    const item = await Wishlist.create({ userId, productId });
    res.status(201).json({ message: "Product added to wishlist", item });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: {
        model: products,
        attributes: ["id", "name", "price"],
      },
    });
    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist: wishlistItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id || req.body.productId;
    const wishlistItem = await Wishlist.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (!wishlistItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    await wishlistItem.destroy();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
