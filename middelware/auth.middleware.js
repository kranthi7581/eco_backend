const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/auth");
dotenv.config();

const secret = process.env.JWT_SECRET;

const authmiddleware = async (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    // verify token
    const decoded = jwt.verify(token, secret);
    // find user in database 
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    // attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Database/server error",
      error: error.message,
    });
  }
};

module.exports = authmiddleware;
