const sendEmail = require("../config/sendEmail");

/**
 * Get status-specific visual configuration
 */
const getStatusConfig = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        label: "Order Placed",
        color: "#d97706", // Amber
        bg: "#fef3c7",
        description: "Your order has been placed successfully and is pending confirmation.",
      };
    case "packing":
      return {
        label: "Processing / Packing",
        color: "#2563eb", // Blue
        bg: "#dbeafe",
        description: "We are carefully preparing and packing your order items.",
      };
    case "shipping":
      return {
        label: "Shipped",
        color: "#7c3aed", // Violet
        bg: "#ede9fe",
        description: "Great news! Your package is on the way. It has been shipped out.",
      };
    case "delivered":
      return {
        label: "Delivered",
        color: "#059669", // Emerald Green
        bg: "#d1fae5",
        description: "Your order has been successfully delivered. Enjoy your purchase!",
      };
    case "completed":
      return {
        label: "Completed",
        color: "#0d9488", // Teal
        bg: "#ccfbf1",
        description: "This order is marked as completed. Thank you for shopping with us!",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "#dc2626", // Red
        bg: "#fee2e2",
        description: "This order has been cancelled. Please contact support if you need assistance.",
      };
    default:
      return {
        label: status,
        color: "#4b5563", // Gray
        bg: "#f3f4f6",
        description: `Your order status has been updated to ${status}.`,
      };
  }
};

/**
 * Generates the HTML layout for the order status email
 */
const generateOrderStatusHtml = (order, user) => {
  const statusInfo = getStatusConfig(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Safe navigation for order items
  const items = order.orderItems || order.OrderItems || [];
  
  // Render table rows for items
  let itemsHtml = "";
  items.forEach((item) => {
    const productName = item.product?.name || item.Product?.name || "Product";
    const unitPrice = item.unitPrice || item.Product?.price || 0;
    const quantity = item.quantity || 1;
    const totalPrice = item.totalPrice || (unitPrice * quantity);

    itemsHtml += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px; text-align: left; font-size: 14px; color: #334155; font-weight: 500;">
          ${productName}
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 14px; color: #475569;">
          ${quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; color: #475569;">
          ₹${unitPrice.toFixed(2)}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; color: #0f172a; font-weight: 600;">
          ₹${totalPrice.toFixed(2)}
        </td>
      </tr>
    `;
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order ${statusInfo.label}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="background-color: #f8fafc; padding: 20px 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
    <!-- Header Banner -->
    <tr>
      <td align="center" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 35px 20px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">
          Ecommerce Shop
        </h2>
        <h1 style="margin: 10px 0 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.025em;">
          Order Update
        </h1>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 30px 24px;">
        <p style="margin-top: 0; margin-bottom: 20px; font-size: 16px; line-height: 1.6; color: #334155;">
          Hello <strong>${user.username || "Valued Customer"}</strong>,
        </p>

        <!-- Status Box -->
        <div style="background-color: ${statusInfo.bg}; border-left: 4px solid ${statusInfo.color}; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 8px 0; color: ${statusInfo.color}; font-size: 18px; font-weight: 600;">
            Status: ${statusInfo.label}
          </h3>
          <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
            ${statusInfo.description}
          </p>
        </div>

        <!-- Order Summary Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; margin-bottom: 30px;">
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 6px; font-weight: 500;">ORDER ID</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 6px; font-weight: 600;">#${order.id}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 6px; font-weight: 500;">ORDER DATE</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 6px; font-weight: 600;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 6px; font-weight: 500;">SHIPPING ADDRESS</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 6px; font-weight: 600; max-width: 250px; word-wrap: break-word;">${order.address || "N/A"}</td>
          </tr>
        </table>

        <!-- Itemized Receipt -->
        <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
          Order Details
        </h4>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 8px 8px 12px 8px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">PRODUCT</th>
              <th style="padding: 8px 8px 12px 8px; text-align: center; font-size: 12px; font-weight: 600; color: #64748b; width: 40px;">QTY</th>
              <th style="padding: 8px 8px 12px 8px; text-align: right; font-size: 12px; font-weight: 600; color: #64748b; width: 80px;">PRICE</th>
              <th style="padding: 8px 8px 12px 8px; text-align: right; font-size: 12px; font-weight: 600; color: #64748b; width: 80px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"></td>
              <td style="padding: 16px 8px; text-align: right; font-size: 15px; color: #475569; font-weight: 500;">Grand Total:</td>
              <td style="padding: 16px 8px; text-align: right; font-size: 18px; color: #0f172a; font-weight: 700;">₹${order.totalPrice?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Call to Action -->
        <div align="center" style="margin-top: 30px; margin-bottom: 10px;">
          <a href="http://localhost:3000/orders" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
            Track Your Order
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
          You received this email because you made a purchase on Ecommerce Shop.<br>
          If you have any questions, reply to this email or contact support.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; font-weight: 600; color: #475569;">
          &copy; ${new Date().getFullYear()} Ecommerce Shop. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Main helper to compile and send the order email
 */
const sendOrderStatusEmail = async (order, user) => {
  if (!user || !user.email) {
    console.error("Cannot send email: User email not provided", { orderId: order.id, user });
    return;
  }

  const statusInfo = getStatusConfig(order.status);
  const subject = `Order #${order.id} Update: ${statusInfo.label}`;
  
  // Clean fallback text representation
  const plainTextMessage = `
Hello ${user.username || "Customer"},

Your order status has been updated.
Order ID: #${order.id}
Current Status: ${statusInfo.label}
Description: ${statusInfo.description}

Total: ₹${order.totalPrice?.toFixed(2)}
Shipping Address: ${order.address}

Track your order here: http://localhost:3000/orders

Thank you for shopping with us!
Ecommerce Shop
  `.trim();

  const htmlMessage = generateOrderStatusHtml(order, user);

  console.log(`Sending email for order #${order.id} (${order.status}) to ${user.email}`);
  await sendEmail(user.email, subject, plainTextMessage, htmlMessage);
};

/**
 * Generates the HTML layout for the payment successful email
 */
const generatePaymentSuccessHtml = (paymentRecord, user) => {
  const formattedDate = new Date(paymentRecord.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="background-color: #f8fafc; padding: 20px 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
    <!-- Header Banner -->
    <tr>
      <td align="center" style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 35px 20px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #ccfbf1;">
          Payment Status
        </h2>
        <h1 style="margin: 10px 0 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.025em;">
          Payment Successful
        </h1>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 30px 24px;">
        <p style="margin-top: 0; margin-bottom: 20px; font-size: 16px; line-height: 1.6; color: #334155;">
          Hello <strong>${user.username || "Valued Customer"}</strong>,
        </p>

        <!-- Status Box -->
        <div style="background-color: #d1fae5; border-left: 4px solid #059669; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 8px 0; color: #059669; font-size: 18px; font-weight: 600;">
            Transaction Completed
          </h3>
          <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
            Your payment for Order #${paymentRecord.orderId} has been successfully verified and completed. Thank you!
          </p>
        </div>

        <!-- Payment Details Card -->
        <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
          Receipt Details
        </h4>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; margin-bottom: 30px;">
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; font-weight: 500;">PAYMENT ID</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 8px; font-weight: 600;">${paymentRecord.razorpayPaymentId}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; font-weight: 500;">ORDER ID</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 8px; font-weight: 600;">#${paymentRecord.orderId}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; font-weight: 500;">TRANSACTION DATE</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 8px; font-weight: 600;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; font-weight: 500;">PAYMENT METHOD</td>
            <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 8px; font-weight: 600;">Razorpay Online</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="font-size: 14px; color: #334155; padding-top: 12px; font-weight: 600;">AMOUNT PAID</td>
            <td align="right" style="font-size: 16px; color: #0d9488; padding-top: 12px; font-weight: 700;">₹${paymentRecord.amount?.toFixed(2)}</td>
          </tr>
        </table>

        <!-- Call to Action -->
        <div align="center" style="margin-top: 30px; margin-bottom: 10px;">
          <a href="http://localhost:3000/orders" style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Order Status
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
          If you have any questions about this receipt, reply to this email or contact support.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; font-weight: 600; color: #475569;">
          &copy; ${new Date().getFullYear()} Ecommerce Shop. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Main helper to compile and send the payment successful email
 */
const sendPaymentSuccessEmail = async (paymentRecord, user) => {
  if (!user || !user.email) {
    console.error("Cannot send email: User email not provided", { paymentId: paymentRecord.id, user });
    return;
  }

  const subject = `Payment Successful for Order #${paymentRecord.orderId}`;
  
  const plainTextMessage = `
Hello ${user.username || "Customer"},

Your payment for Order #${paymentRecord.orderId} was completed successfully.

Payment Details:
- Transaction ID: ${paymentRecord.razorpayPaymentId}
- Amount Paid: ₹${paymentRecord.amount?.toFixed(2)}
- Payment Method: Razorpay

We are now processing your order.

Thank you for shopping with us!
Ecommerce Shop
  `.trim();

  const htmlMessage = generatePaymentSuccessHtml(paymentRecord, user);

  console.log(`Sending payment confirmation email for order #${paymentRecord.orderId} to ${user.email}`);
  await sendEmail(user.email, subject, plainTextMessage, htmlMessage);
};

module.exports = {
  sendOrderStatusEmail,
  generateOrderStatusHtml,
  sendPaymentSuccessEmail,
  generatePaymentSuccessHtml,
};
