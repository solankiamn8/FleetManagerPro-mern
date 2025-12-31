// controllers/inviteController.js
import crypto from "crypto";
import Invite from "../models/Invite.js";
import User from "../models/User.js";
import { sendInviteEmail } from "../utils/mailer.js";


{/* POST /api/invites */}
export const inviteUser = async (req, res) => {
  const { email, role } = req.body;

  if (!["manager", "driver"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Prevent duplicate users
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invite = await Invite.create({
    email,
    role,
    organization: req.user.organization,
    invitedBy: req.user.id,
    token,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hrs
  });

  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  await sendInviteEmail({
    to: email,
    inviteLink,
    role,
  });

  res.json({ message: "Invite sent successfully" });
};

{/* POST /api/invites/accept */}
export const acceptInvite = async (req, res) => {
  const { token, name, password } = req.body;

  const invite = await Invite.findOne({
    token,
    used: false,
    expiresAt: { $gt: Date.now() },
  });

  if (!invite) {
    return res.status(400).json({ message: "Invalid or expired invite" });
  }

  const user = await User.create({
    name,
    email: invite.email,
    password,
    role: invite.role,
    organization: invite.organization,
    emailVerified: false,
  });

  invite.used = true;
  await invite.save();

  res.status(201).json({
    message: "Account created. Please verify email.",
  });
};
