import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      number: {
        type: String,
        unique: true,
        sparse: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },

    role: {
      type: String,
      enum: ["admin", "manager", "driver"],
      default: "manager",
      index: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },


    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    // OTP (email / phone)
    otpCode: String,
    otpExpiresAt: Date,

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

/* 🔐 Hash password before save */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* 🔑 Compare password during login */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
