import mongoose from "mongoose"

const activitySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "invite_sent",
        "invite_resent",
        "invite_accepted",
        "invite_revoked",
        "user_suspended",
        "user_activated",
        "user_removed",
      ],
      required: true,
      index: true,
    },

    targetEmail: String,
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
)

export default mongoose.model("Activity", activitySchema)
