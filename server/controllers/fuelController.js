import FuelLog from "../models/FuelLog.js";
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import { getDateRange } from "../utils/dateRange.js";

export const addFuelLog = async (req, res) => {
  const { tripId, liters, pricePerLiter } = req.body;

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  if (!trip.driver.equals(req.user.id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!["IN_PROGRESS", "SYSTEM_COMPLETED"].includes(trip.status)) {
    return res.status(400).json({
      message: "Fuel logs can only be added during or right after trip",
    });
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  const totalCost = liters * pricePerLiter;

  const fuelLog = await FuelLog.create({
    trip: trip._id,
    vehicle: vehicle._id,
    driver: req.user.id,
    liters,
    pricePerLiter,
    totalCost,
  });

  res.status(201).json({
    message: "Fuel entry recorded",
    fuelLog,
  });
};

export const getTripFuelSummary = async (req, res) => {
  const { tripId } = req.params;

  const trip = await Trip.findById(tripId).populate("vehicle");
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const logs = await FuelLog.find({ trip: tripId });

  const actualLiters = logs.reduce((sum, l) => sum + l.liters, 0);
  const actualCost = logs.reduce((sum, l) => sum + l.totalCost, 0);

  const distanceKm =
    trip.routeOptions[trip.selectedRouteIndex].distanceKm;

  const expectedLiters =
    distanceKm / trip.vehicle.fuelEfficiency;

  const inefficient =
    actualLiters > expectedLiters * 1.15;

  res.json({
    distanceKm,
    expectedLiters: +expectedLiters.toFixed(2),
    actualLiters: +actualLiters.toFixed(2),
    actualCost,
    inefficient,
  });
};


export const fuelCostOverTime = async (req, res) => {
  const { from, to } = getDateRange(req.query);

  const match = {};
  if (from && to) {
    match.createdAt = { $gte: from, $lte: to };
  }

  const data = await FuelLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalCost: { $sum: "$totalCost" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json(data);
};

export const fuelByVehicle = async (req, res) => {
  const data = await FuelLog.aggregate([
    {
      $group: {
        _id: "$vehicle",
        totalFuelCost: { $sum: "$totalCost" },
        totalLiters: { $sum: "$liters" },
      },
    },
  ]);

  res.json(data);
};

export const inefficientTrips = async (req, res) => {
  const trips = await Trip.find({ status: "DRIVER_CONFIRMED" })
    .populate("vehicle")
    .populate("driver");

  const result = [];

  for (const trip of trips) {
    const logs = await FuelLog.find({ trip: trip._id });
    const actual = logs.reduce((s, l) => s + l.liters, 0);

    const expected =
      trip.routeOptions[trip.selectedRouteIndex].distanceKm /
      trip.vehicle.fuelEfficiency;

    if (actual > expected * 1.15) {
      result.push({
        tripId: trip._id,
        driver: trip.driver.name,
        vehicle: trip.vehicle.licensePlate,
        expected: expected.toFixed(2),
        actual: actual.toFixed(2),
      });
    }
  }

  res.json(result);
};
