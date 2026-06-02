const { DataTypes } = require("sequelize");
const { sequelize_orm } = require("../../config/db");

const coupon = sequelize_orm.define(
  "Coupon",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    discountType: {
      type: DataTypes.ENUM("percentage", "fixed"),
    },

    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    minOrderAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    maxDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    usageLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = coupon;
