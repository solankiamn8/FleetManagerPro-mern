// models/Invite.js
import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["manager", "driver"],
      required: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    used: {
      type: Boolean,
      default: false,
    },

    acceptedAt: {
      type: Date,
    },

    acceptedByIp: {
      type: String,
    },

    acceptedByUserAgent: {
      type: String,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);
