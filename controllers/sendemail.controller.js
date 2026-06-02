const usermodel = require("../models/auth");
const sendEmail = require("../config/sendEmail");
const bcrypt = require("bcryptjs");

const sendemail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usermodel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await usermodel.update(
      {
        resetOTP: hashedOtp,
        resetOTPExpires: new Date(Date.now() + 1 * 60 * 1000),
      },
      {
        where: { email },
      },
    );

    const subject = "Password Reset OTP";
    const message = `Your OTP for password reset is: ${otp}`;
    await sendEmail(email, subject, message);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await usermodel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.resetOTP) {
      return res.status(400).json({ message: "OTP not found" });
    }
    const isOTPValid = await bcrypt.compare(otp, user.resetOTP);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

const restpassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await usermodel.update(
      { password: hashedPassword, resetOTP: null, resetOTPExpires: null },
      { where: { email } },
    );
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};

module.exports = {
  sendemail,
  verifyOTP,
  restpassword,
};
