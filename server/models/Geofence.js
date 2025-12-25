import mongoose from "mongoose";

const geofenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    area: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // GeoJSON polygon
        required: true,
      },
    },

    active: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

geofenceSchema.index({ area: "2dsphere" });

export default mongoose.model("Geofence", geofenceSchema);
