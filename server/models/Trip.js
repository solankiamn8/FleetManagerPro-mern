import mongoose from "mongoose";

const routePointSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

const routeOptionSchema = new mongoose.Schema(
  {
    name: String, // e.g. "Fastest", "Shortest", "Fuel Efficient"
    distanceKm: Number,
    estimatedTimeMin: Number,
    polyline: [routePointSchema], // actual road path
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    // Relations
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // manager/admin
      required: true,
    },

    // Route planning
    startLocation: {
      name: String,
      lat: Number,
      lng: Number,
    },

    endLocation: {
      name: String,
      lat: Number,
      lng: Number,
    },

    routeOptions: [routeOptionSchema],

    selectedRouteIndex: {
      type: Number,
      default: 0,
    },

    // Trip lifecycle
    status: {
      type: String,
      enum: ["PLANNED", "ASSIGNED", "IN_PROGRESS", "SYSTEM_COMPLETED", "DRIVER_CONFIRMED", "CANCELLED"],
      default: "PLANNED",
      index: true,
    },

    driverConfirmed: {
      type: Boolean,
      default: false,
    },

    driverRemarks: {
      type: String,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    startedAt: Date,
    endedAt: Date,

    // Tracking progress
    currentRouteIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
