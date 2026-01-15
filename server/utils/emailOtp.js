// utils/emailOtp.js
import crypto from "crypto";
import { sendOTPEmail } from "./mailer.js";

export const generateEmailOTP = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min
  await user.save();

  try {
    await sendOTPEmail({
      to: user.email,
      otp,
    }); 
  } catch (error) {
    console.error("OTP email failed", error.message)
  }
    
};
