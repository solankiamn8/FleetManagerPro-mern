import mongoose from "mongoose";

const fuelLogSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    liters: {
      type: Number,
      required: true,
      min: 0.1,
    },

    pricePerLiter: {
      type: Number,
      required: true,
      min: 1,
    },

    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FuelLog", fuelLogSchema);
