import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { sendOTPEmail } from "../utils/mailer.js";
import { serializeUser } from "../utils/serializeUser.js";



const sign = (user) => jwt.sign({ id: user._id, role: user.role, name: user.name }, env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    await User.create({ name, email, password, role });

    res.status(201).json({
      message: "Registration successful. Please login to continue.",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    // 🔐 OTP check
    if (!user.emailVerified) {

      // ✅ CLEAR OLD OTP (IMPORTANT)
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
      user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
      await user.save();

      await sendOTPEmail({ to: user.email, otp });

      return res.json({
        otpRequired: true,
        message: "OTP sent to registered email",
        userId: user._id,
      });
    }


    res.json({
      token: sign(user),
      user: serializeUser(user),
    });


  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: serializeUser(user) });
};


export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If that email exists, reset link was sent (simulated)' });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 hour
  await user.save();

  // TODO: send email - for now return token in response (simulate)
  return res.json({ message: 'Password reset token (simulated)', token });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated' });
};

// this is to check email-OTP only
export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
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


  user.emailVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.json({
    token: sign(user),
    user: serializeUser(user),
    message: "OTP verified successfully",
  });

};

