import crypto from "crypto";
import User from "../models/User.js";
import { serializeUser } from "../utils/serializeUser.js"
import jwt from "jsonwebtoken"

export const submitPhoneNumber = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  console.log(`📱 Phone OTP for ${phone}: ${otp}`);

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findById(req.user.id);
  user.phone = {
    number: phone,
    verified: false,
  };

  user.otpCode = hashedOtp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min
  await user.save();

  res.json({
    token: jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    ),
    user: serializeUser(user),
  })
};

export const verifyPhoneOTP = async (req, res) => {
  const { otp } = req.body;

  const user = await User.findById(req.user.id);
  if (!user || !user.otpCode) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedOtp !== user.otpCode) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.phone.verified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.json({
    message: "Phone number verified successfully",
    user: {
      phone: user.phone,
    },
  });
};

// controllers/userController.js
export const getDrivers = async (req, res) => {
  const drivers = await User.find(
    { role: "driver" },
    { name: 1, email: 1, phone: 1 }
  )

  res.json(drivers)
}

