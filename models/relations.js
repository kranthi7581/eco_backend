const User = require("./auth");
const Category = require("./ADMIN/categories");
const subcategory = require("./ADMIN/subcategories");
const products = require("./ADMIN/products");
const Cart = require("./USER/cart");
const CartItem = require("./USER/cartItem");
const Wishlist = require("./USER/wishlist");
const orders = require("./USER/orders");
const orderItems = require("./USER/orderItems");
const coupons = require("./ADMIN/coupon");
const payment = require("./USER/payment");
const Address = require("./USER/Address");
const Review = require("./USER/Review");
const ChatMessage = require("./ChatMessage");

// Define associations for categories
Category.hasMany(subcategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

subcategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});


// Define associations for subcategories
Category.hasMany(subcategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

subcategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

// Define associations for products
subcategory.hasMany(products, {
  foreignKey: "subcategoryId",
  onDelete: "CASCADE",
});

products.belongsTo(subcategory, {
  foreignKey: "subcategoryId",
  onDelete: "CASCADE",
});

Category.hasMany(products, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

products.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

// Define associations for cart
User.hasOne(Cart, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
});

products.hasMany(CartItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

CartItem.belongsTo(products, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

User.belongsToMany(products, {
  through: Wishlist,
  foreignKey: "userId",
  otherKey: "productId",
  onDelete: "CASCADE",
  as: "wishlistProducts",
});

products.belongsToMany(User, {
  through: Wishlist,
  foreignKey: "productId",
  otherKey: "userId",
  onDelete: "CASCADE",
  as: "wishlistUsers",
});

// Define associations for wishlist
Wishlist.belongsTo(products, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

products.hasMany(Wishlist, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

// Define associations for orders
User.hasMany(orders, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

orders.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

// Define associations for order items
orders.hasMany(orderItems, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

orderItems.belongsTo(orders, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

products.hasMany(orderItems, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

orderItems.belongsTo(products, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

// Define associations for coupons
coupons.hasMany(orders, {
  foreignKey: "couponId",
  onDelete: "CASCADE",
});

orders.belongsTo(coupons, {
  foreignKey: "couponId",
  onDelete: "CASCADE",
});

// Define associations for payment
orders.hasOne(payment, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

payment.belongsTo(orders, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

//define associations for address
User.hasMany(Address, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Address.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

//define associations for review
User.hasMany(Review, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Review.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Review.belongsTo(products, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

products.hasMany(Review, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

Review.belongsTo(orders, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

orders.hasMany(Review, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

// Define associations for ChatMessage
User.hasMany(ChatMessage, {
  foreignKey: "senderId",
  as: "sentMessages",
  onDelete: "CASCADE",
});

User.hasMany(ChatMessage, {
  foreignKey: "receiverId",
  as: "receivedMessages",
  onDelete: "CASCADE",
});

ChatMessage.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
});

ChatMessage.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
  onDelete: "CASCADE",
});


module.exports = {
  User,
  Category,
  subcategory,
  products,
  Cart,
  CartItem,
  Wishlist,
  orders,
  orderItems,
  coupons,
  payment,
  Address,
  Review,
  ChatMessage,
};
