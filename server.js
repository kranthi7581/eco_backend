const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, ".env") });
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
  "https://ecofrontend-gules.vercel.app",
  "https://ecofrontend-chi.vercel.app",
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
const { ChatMessage } = require("./models/relations");

const PORT = process.env.PORT || 5000;

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 30000,
  transports: ["websocket", "polling"],
});

// Middleware to authenticate socket connections
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Socket authentication error:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`User connected to socket: ${socket.user.id} (${socket.user.role})`);
  
  socket.join(`room_${socket.user.id}`);
  
  if (socket.user.role === "admin") {
    socket.join("room_admins");
  }

  socket.on("send_message", async (data, callback) => {
    try {
      const { receiverId, message } = data;
      if (!receiverId || !message) {
        if (callback) callback({ status: "error", message: "Invalid payload" });
        return;
      }

      const { ChatMessage, User } = require("./models/relations");
      const savedMessage = await ChatMessage.create({
        senderId: socket.user.id,
        receiverId,
        message,
        isRead: false,
      });

      const fullMessage = await ChatMessage.findByPk(savedMessage.id, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "username", "image", "role"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["id", "username", "image", "role"],
          },
        ],
      });

      io.to(`room_${receiverId}`).emit("new_message", fullMessage);
      io.to(`room_${socket.user.id}`).emit("new_message", fullMessage);

      if (socket.user.role !== "admin") {
        io.to("room_admins").emit("new_user_message", {
          senderId: socket.user.id,
          message: fullMessage,
        });
      }

      if (callback) callback({ status: "ok", message: fullMessage });
    } catch (err) {
      console.error("Error sending message via socket:", err);
      if (callback) callback({ status: "error", message: err.message });
    }
  });

  socket.on("typing", (data) => {
    const { receiverId, isTyping } = data;
    io.to(`room_${receiverId}`).emit("typing_status", {
      senderId: socket.user.id,
      isTyping,
    });
  });

  socket.on("read_messages", async (data) => {
    try {
      const { senderId } = data;
      const { ChatMessage } = require("./models/relations");
      
      await ChatMessage.update(
        { isRead: true },
        {
          where: {
            senderId,
            receiverId: socket.user.id,
            isRead: false,
          },
        }
      );

      io.to(`room_${senderId}`).emit("messages_read", {
        readerId: socket.user.id,
      });
    } catch (err) {
      console.error("Error marking messages read via socket:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected from socket: ${socket.user.id}`);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await ChatMessage.sync();
    console.log("Database & ChatMessage table synchronized successfully");
    server.listen(PORT, () => {
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

const chatRoutes = require("./routes/chat");
app.use("/chat", chatRoutes);
