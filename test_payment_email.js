const path = require("path");
require("dotenv").config();

const { sendPaymentSuccessEmail } = require("./utils/emailTemplates");

async function testEmail() {
  console.log("Starting payment success email verification test...");

  // Mock User
  const mockUser = {
    username: "Test Customer",
    email: process.env.MY_EMAIL // Send to configured email for verification
  };

  // Mock Payment Record
  const mockPayment = {
    id: 9988,
    razorpayOrderId: "order_mock123",
    razorpayPaymentId: "pay_mock789",
    orderId: 12345,
    amount: 1499.99,
    status: "completed",
    createdAt: new Date()
  };

  try {
    console.log(`Sending payment test email to ${mockUser.email}...`);
    await sendPaymentSuccessEmail(mockPayment, mockUser);
    console.log("Payment success test email sent successfully!");
  } catch (error) {
    console.error("Test email failed:", error);
  }
}

testEmail();
