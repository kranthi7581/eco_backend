const { DataTypes } = require("sequelize");
const { sequelize_orm } = require("../../config/db");

const Wishlist = sequelize_orm.define(
  "Wishlist",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Wishlist;
