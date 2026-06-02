
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require('path');
const fileHelper = require("./utils/fileHelper");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  next(err);
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://ecofrontend-vert.vercel.app",
  "https://ecofrontend-tau.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

if (fileHelper && typeof fileHelper.ensureUploadDir === 'function') {
  fileHelper.ensureUploadDir();
}

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const { connectDB, sequelize_orm } = require("./config/db");
require("./models/relations");

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    //await sequelize_orm.sync();
    console.log("Database synchronized successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const categoryRoutes = require("./routes/ADMIN/categories");
app.use("/categories", categoryRoutes);

const subcategoryRoutes = require("./routes/ADMIN/subcategories");
app.use("/subcategories", subcategoryRoutes);

const productRoutes = require("./routes/ADMIN/products");
app.use("/products", productRoutes);

const cartRoutes = require("./routes/USER/cart");
app.use("/cart", cartRoutes);

const wishlistRoutes = require("./routes/USER/wishlist");
app.use("/wishlist", wishlistRoutes);

const addressRoutes = require("./routes/USER/address");
app.use("/address", addressRoutes);

const reviewRoutes = require("./routes/USER/review");
app.use("/review", reviewRoutes);

const checkoutRoutes = require("./routes/USER/checkout");
app.use("/checkout", checkoutRoutes);

const ordersRoutes = require("./routes/USER/orders");
app.use("/orders", ordersRoutes);

const orderstatusRoutes = require("./routes/ADMIN/orderstatus");
app.use("/orderstatus", orderstatusRoutes);

const couponRoutes = require("./routes/ADMIN/coupon");
app.use("/coupon", couponRoutes);

const paymentRoutes = require("./routes/USER/payment");
app.use("/payment", paymentRoutes);
