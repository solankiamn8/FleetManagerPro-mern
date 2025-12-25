import mongoose from "mongoose";

const maintenanceScheduleSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    type: {
      type: String,
      enum: ["oil", "service", "tire", "brake", "other"],
      required: true,
    },

    dueAtDate: Date, // optional
    dueAtMileage: Number, // optional

    active: {
      type: Boolean,
      default: true,
    },

    lastNotifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model(
  "MaintenanceSchedule",
  maintenanceScheduleSchema
);
