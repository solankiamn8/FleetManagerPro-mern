import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceSchedule",
    },

    type: {
      type: String,
      enum: ["oil", "service", "tire", "brake", "other"],
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    notes: String,

    servicedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceLog", maintenanceLogSchema);
