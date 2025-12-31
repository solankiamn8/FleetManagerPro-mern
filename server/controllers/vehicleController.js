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

  const exists = await Vehicle.findOne({
    licensePlate,
    organization: req.user.organization,
  });

  if (exists) {
    return res.status(400).json({
      message: "Vehicle already exists in your organization",
    });
  }

  const vehicle = await Vehicle.create({
    make,
    model,
    licensePlate,
    mileage,
    fuelEfficiency,
    organization: req.user.organization,
  });

  res.status(201).json({
    message: "Vehicle created successfully",
    vehicle,
  });
};

export const assignDriverToVehicle = async (req, res) => {
  const { vehicleId, driverId } = req.body;

  const driver = await User.findOne({
    _id: driverId,
    role: "driver",
    organization: req.user.organization,
  });

  if (!driver) {
    return res.status(400).json({ message: "Invalid driver" });
  }

  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    organization: req.user.organization,
  });

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  vehicle.assignedDriver = driver._id;
  await vehicle.save();

  res.json({ message: "Driver assigned successfully" });
};

export const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({
    organization: req.user.organization,
  })
    .populate("assignedDriver", "name phone")
    .sort({ createdAt: -1 });

  res.json(vehicles);
};

