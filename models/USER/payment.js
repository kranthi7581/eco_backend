const { DataTypes } = require("sequelize");
const { sequelize_orm } = require("../../config/db");

const payment = sequelize_orm.define(
  "Payment",
  {
    razorpayOrderId: {
      type: DataTypes.STRING,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = payment;
