import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

export const createVehicle = async (req, res) => {
  const {
    make,
    model,
    licensePlate,
    mileage,
    fuelEfficiency,
  } = req.body;

  const exists = await Vehicle.findOne({ licensePlate });
  if (exists) {
    return res.status(400).json({
      message: "Vehicle with this license plate already exists",
    });
  }

  const vehicle = await Vehicle.create({
    make,
    model,
    licensePlate,
    mileage,
    fuelEfficiency,
  });

  res.status(201).json({
    message: "Vehicle created successfully",
    vehicle,
  });
};


export const assignDriverToVehicle = async (req, res) => {
  const { vehicleId, driverId } = req.body;

  const driver = await User.findById(driverId);
  if (!driver || driver.role !== "driver") {
    return res.status(400).json({
      message: "Selected user is not a driver",
    });
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  vehicle.assignedDriver = driver._id;
  await vehicle.save();

  res.json({ message: "Driver assigned to vehicle successfully" });
};

export const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find()
    .populate("assignedDriver", "name phone") // 👈 important
    .sort({ createdAt: -1 });

  res.json(vehicles);
};
