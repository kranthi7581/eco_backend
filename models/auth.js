const { DataTypes } = require("sequelize");
const { sequelize_orm } = require("../config/db");
// const bcrypt = require('bcrypt');

const User = sequelize_orm.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    resetOTP: {
      type: DataTypes.STRING,
    },
    resetOTPExpires: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

// User.beforeCreate(async (user) => {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
// });

module.exports = User;
