import crypto from "crypto";
import User from "../models/User.js";
import { serializeUser } from "../utils/serializeUser.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { logActivity } from "../utils/logActivity.js"
import { sendAccountStatusEmail } from "../utils/mailer.js";
import Organization from "../models/Organization.js"


{/* Phone Verification*/ }
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

  const response = {
    token: jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    ),
    user: serializeUser(user),
  }

  if (process.env.NODE_ENV !== "production") {
    response.devOtp = otp
  }

  res.json(response)
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

{/* Driver Details*/ }
export const getDrivers = async (req, res) => {
  const drivers = await User.find(
    {
      role: "driver",
      organization: req.user.organization,
    },
    { name: 1, email: 1, phone: 1 }
  );

  res.json(drivers);
};

export const getDriverById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid driver ID" });
  }

  const driver = await User.findOne({
    _id: id,
    role: "driver",
    organization: req.user.organization,
  });

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  res.json(driver);
};


export const getDriversWithStats = async (req, res) => {
  const drivers = await User.aggregate([
    { $match: { role: "driver", organization: req.user.organization } },

    {
      $lookup: {
        from: "trips",
        localField: "_id",
        foreignField: "driver",
        as: "trips",
      },
    },

    {
      $addFields: {
        tripsCount: {
          $size: {
            $filter: {
              input: "$trips",
              as: "trip",
              cond: { $eq: ["$$trip.status", "DRIVER_CONFIRMED"] },
            },
          },
        },
      },
    },

    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        tripsCount: 1,
      },
    },
  ]);

  res.json(drivers);
};

{/* Team Details*/ }
export const getTeamMembers = async (req, res) => {
  const org = await Organization.findById(req.user.organization)

  const users = await User.find({
    organization: req.user.organization,
    isDeleted: false,
  })
    .sort({ role: 1, createdAt: 1 })
    .select("name email role emailVerified status createdAt")
    .lean()

  const result = users.map(u => ({
    ...u,
    isOwner: u._id.equals(org.owner),
  }))

  res.json(result)

}

// 🔒 Suspend user
export const suspendUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization,
    isDeleted: false,
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const org = await Organization.findById(req.user.organization)

  if (user._id.equals(org.owner)) {
    return res.status(403).json({
      message: "You cannot modify the organization owner",
    })
  }

  if (user._id.equals(req.user.id)) {
    return res.status(400).json({ message: "You cannot suspend yourself" })
  }

  user.status = "suspended"
  user.suspendedAt = new Date()
  user.suspendedBy = req.user.id
  user.suspensionReason = "Policy violation" // optional
  await user.save()

  await logActivity({
    organization: req.user.organization,
    actor: req.user.id,
    type: "user_suspended",
    targetUser: user._id,
    targetEmail: user.email,
  })

  await sendAccountStatusEmail({
    to: user.email,
    status: "suspended",
    orgName: org.name,
    managerName: req.user.name,
  })

  res.json({ message: "User suspended" })
}

// 🔓 Reactivate user
export const activateUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization,
    isDeleted: false,
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  const org = await Organization.findById(req.user.organization)

  if (user._id.equals(org.owner)) {
    return res.status(403).json({
      message: "You cannot modify the organization owner",
    })
  }

  if (user._id.equals(req.user.id)) {
    return res.status(400).json({
      message: "You cannot modify yourself",
    })
  }


  user.status = "active"
  await user.save()

  await logActivity({
    organization: req.user.organization,
    actor: req.user.id,
    type: "user_activated",
    targetUser: user._id,
    targetEmail: user.email,
  })

  await sendAccountStatusEmail({
    to: user.email,
    status: "activated",
    orgName: org.name,
    managerName: req.user.name,
  })


  res.json({ message: "User activated" })
}

// 🗑 Soft remove user
export const removeUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization,
    isDeleted: false,
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const org = await Organization.findById(req.user.organization)

  if (user._id.equals(org.owner)) {
    return res.status(403).json({
      message: "You cannot modify the organization owner",
    })
  }

  if (user._id.equals(req.user.id)) {
    return res.status(400).json({ message: "You cannot remove yourself" })
  }

  user.isDeleted = true
  user.status = "suspended"
  await user.save()

  await logActivity({
    organization: req.user.organization,
    actor: req.user.id,
    type: "user_removed",
    targetUser: user._id,
    targetEmail: user.email,
  })

  res.json({ message: "User removed from organization" })
}

