const express = require("express");
const router = express.Router();
const { ChatMessage, User } = require("../models/relations");
const authmiddleware = require("../middelware/auth.middleware");
const authorize = require("../middelware/authorize.middleware");
const { Op } = require("sequelize");

// Helper to get the first admin ID in the system
const getAdminId = async () => {
  const admin = await User.findOne({ where: { role: "admin" } });
  return admin ? admin.id : null;
};

// GET /chat/admin-info - Get basic admin info (accessible to logged in users)
router.get("/admin-info", authmiddleware, async (req, res) => {
  try {
    const admin = await User.findOne({
      where: { role: "admin" },
      attributes: ["id", "username", "image"]
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin info:", error);
    res.status(500).json({ message: "Failed to fetch admin details" });
  }
});

// GET /chat/history/:userId - Fetch history between a user and admin
router.get("/history/:userId", authmiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    let targetUserId;

    if (currentUserRole === "admin") {
      // Admin is asking for history with a specific user
      targetUserId = parseInt(req.params.userId);
      if (isNaN(targetUserId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
    } else {
      // User is asking for history with admin
      const adminId = await getAdminId();
      if (!adminId) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      targetUserId = adminId;
    }

    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId }
        ]
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "image", "role"]
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "username", "image", "role"]
        }
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history", error: error.message });
  }
});

// GET /chat/conversations - List conversations for Admin panel
router.get("/conversations", authmiddleware, authorize("admin"), async (req, res) => {
  try {
    const adminId = req.user.id;

    // Fetch all users with role 'user'
    const users = await User.findAll({
      where: { role: "user" },
      attributes: ["id", "username", "email", "image", "is_active"]
    });

    const conversations = [];

    for (const user of users) {
      // Find the last message between this user and admin
      const lastMessage = await ChatMessage.findOne({
        where: {
          [Op.or]: [
            { senderId: user.id, receiverId: adminId },
            { senderId: adminId, receiverId: user.id }
          ]
        },
        order: [["createdAt", "DESC"]]
      });

      if (lastMessage) {
        // Count unread messages sent by this user to admin
        const unreadCount = await ChatMessage.count({
          where: {
            senderId: user.id,
            receiverId: adminId,
            isRead: false
          }
        });

        conversations.push({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            image: user.image,
            is_active: user.is_active
          },
          lastMessage: lastMessage.message,
          lastMessageAt: lastMessage.createdAt,
          unreadCount
        });
      }
    }

    // Sort by last message date descending (newest chat first)
    conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching admin conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations", error: error.message });
  }
});

// POST /chat/read/:otherUserId - Mark incoming messages from otherUserId as read
router.post("/read/:otherUserId", authmiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    let otherUserId = parseInt(req.params.otherUserId);

    if (req.user.role !== "admin" && isNaN(otherUserId)) {
      // If regular user calls it without a valid user ID, assume otherUser is admin
      const adminId = await getAdminId();
      otherUserId = adminId;
    }

    if (!otherUserId) {
      return res.status(404).json({ message: "Target user not found" });
    }

    await ChatMessage.update(
      { isRead: true },
      {
        where: {
          senderId: otherUserId,
          receiverId: currentUserId,
          isRead: false
        }
      }
    );

    res.status(200).json({ message: "Messages marked as read successfully" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Failed to mark messages as read", error: error.message });
  }
});

module.exports = router;
