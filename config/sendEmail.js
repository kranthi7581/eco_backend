const nodemailer = require("nodemailer");
const path = require("path");
const dns = require("dns");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const sendEmail = async (email, subject, message, html) => {
  // If Brevo API Key is present in the environment variables (Render), use the HTTPS HTTP API.
  // This bypasses the outbound SMTP port blocks (25/465/587) entirely since it runs over port 443 (HTTPS).
  if (process.env.BREVO_API_KEY) {
    try {
      console.log(`Sending email to ${email} via Brevo HTTP API...`);
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "Ecommerce Shop", email: process.env.MY_EMAIL || "kranthikumarakula7@gmail.com" },
          to: [{ email: email }],
          subject: subject,
          textContent: message,
          htmlContent: html || `<p>${message}</p>`
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Email sent successfully via Brevo HTTP API", data);
        return;
      } else {
        console.error("Brevo API error response:", data);
        // Fall through to SMTP fallback if API fails
      }
    } catch (apiError) {
      console.error("Error calling Brevo HTTP API, trying SMTP fallback:", apiError);
    }
  }

  // Local SMTP Fallback (works on your local machine)
  console.log(`Sending email to ${email} via Gmail SMTP...`);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // false for 587 (STARTTLS), true for 465
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { family: 4 }, callback);
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: subject,
    text: message,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via SMTP");
  } catch (error) {
    console.error("Error sending email via SMTP:", error);
  }
};

module.exports = sendEmail;
