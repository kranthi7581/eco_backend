const { DataTypes } = require("sequelize");
const { sequelize_orm } = require("../../config/db");

const Cart = sequelize_orm.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Cart;
