// controllers/inviteController.js
import crypto from "crypto";
import Invite from "../models/Invite.js";
import User from "../models/User.js";
import { sendInviteEmail } from "../utils/mailer.js";
import Organization from "../models/Organization.js";
import { logActivity } from "../utils/logActivity.js";


{/* POST /api/invites */ }
export const inviteUser = async (req, res) => {
  const { email, role } = req.body;

  if (!["manager", "driver"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // 🚫 Only owner can invite managers
  if (role === "manager") {
    const org = await Organization.findById(req.user.organization);

    if (!org.owner.equals(req.user.id)) {
      return res.status(403).json({
        message: "Only organization owner can invite managers",
      });
    }
  }

  // 🚫 Prevent duplicate users
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 🚫 Prevent duplicate active invites
  if (
    await Invite.findOne({
      email,
      organization: req.user.organization,
      used: false,
      expiresAt: { $gt: Date.now() },
    })
  ) {
    return res.status(400).json({
      message: "An active invite already exists for this email",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  let invite; // 🔑 important

  try {
    invite = await Invite.create({
      email,
      role,
      organization: req.user.organization,
      invitedBy: req.user.id,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    const org = await Organization.findById(req.user.organization)

    await sendInviteEmail({
      to: email,
      inviteLink,
      role,
      orgName: org.name,
      invitedByName: req.user.name,
      invitedByEmail: req.user.email,
    })

    await logActivity({
      organization: req.user.organization,
      actor: req.user.id,
      type: "invite_sent",
      targetEmail: email,
    })

    return res.json({ message: "Invite sent successfully" });

  } catch (err) {
    console.error("Invite flow failed:", err.message);

    // 🔥 ROLLBACK
    if (invite) {
      await Invite.deleteOne({ _id: invite._id });
    }

    return res.status(500).json({
      message: "Failed to send invite email",
    });
  }
};

{/* POST /api/invites/accept */ }
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

  invite.used = true
  invite.acceptedAt = new Date()
  invite.acceptedByIp = req.ip
  invite.acceptedByUserAgent = req.headers["user-agent"]

  await invite.save()

  await logActivity({
    organization: invite.organization,
    actor: user._id,
    type: "invite_accepted",
    targetUser: user._id,
  })

  res.status(201).json({
    message: "Account created. Please verify email.",
    userId: user._id,
  });
};

{/* POST /api/:id/resend */ }
export const resendInvite = async (req, res) => {
  const invite = await Invite.findOne({
    _id: req.params.id,
    organization: req.user.organization,
    used: false,
  }).populate("invitedBy", "name email")

  if (!invite) {
    return res.status(404).json({ message: "Invite not found" })
  }

  const org = await Organization.findById(invite.organization)

  invite.token = crypto.randomBytes(32).toString("hex")
  invite.expiresAt = Date.now() + 24 * 60 * 60 * 1000
  await invite.save()

  const link = `${process.env.FRONTEND_URL}/accept-invite?token=${invite.token}`

  await sendInviteEmail({
    to: invite.email,
    inviteLink: link,
    role: invite.role,
    orgName: org.name,
    invitedByName: invite.invitedBy.name,
    invitedByEmail: invite.invitedBy.email,
  })

  await logActivity({
    organization: req.user.organization,
    actor: req.user.id,
    type: "invite_resent",
    targetEmail: invite.email,
  })


  res.json({ message: "Invite resent" })
}

// GET /api/invites
export const getInvites = async (req, res) => {
  const invites = await Invite.find({
    organization: req.user.organization,
    used: false,
    expiresAt: { $gt: Date.now() },
  }).sort({ createdAt: -1 });

  res.json(invites);
};

// DELETE /api/:id
export const revokeInvite = async (req, res) => {
  const invite = await Invite.findOne({
    _id: req.params.id,
    organization: req.user.organization,
    used: false,
  });

  if (!invite) {
    return res.status(404).json({ message: "Invite not found" });
  }

  await invite.deleteOne();

  await logActivity({
    organization: req.user.organization,
    actor: req.user.id,
    type: "invite_revoked",
    targetEmail: invite.email,
  })


  res.json({ message: "Invite revoked" });
};

