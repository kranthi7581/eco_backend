const userModel = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendWelcomeEmail } = require("../utils/emailTemplates");
dotenv.config();
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET || secret + "_refresh";
const cookieParser = require("cookie-parser");
cookieParser();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Send welcome email asynchronously
    sendWelcomeEmail(newUser).catch((err) => {
      console.error("Error sending registration welcome email:", err);
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      where: { email },
      attributes: ["id", "username", "email", "password", "role", "image"],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      refreshSecret,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
};

const refreshToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const token = tokenFromCookie || tokenFromBody;

    if (!token) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    const decoded = jwt.verify(token, refreshSecret);
    const user = await userModel.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign(
      { id: user.id, role: user.role },
      refreshSecret,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({
      message: "Invalid or expired refresh token",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, phone, role, is_active, password } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await userModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updatedFields = {
      username: username ?? user.username,
      email: email ?? user.email,
      phone: phone ?? user.phone,
      image: image ?? user.image,
      role: role ?? user.role,
      is_active: is_active ?? user.is_active,
    };

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedFields);

    const updatedUser = await userModel.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, phone, role, is_active } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: role || "user",
      image: image || null,
      is_active: is_active !== "false" && is_active !== false,
    });

    // Send welcome email asynchronously
    sendWelcomeEmail(newUser).catch((err) => {
      console.error("Error sending user creation welcome email:", err);
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
  createUser,
};
