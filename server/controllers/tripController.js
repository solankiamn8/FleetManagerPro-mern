import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import { getRouteOptionsFromORS } from "../utils/ors.js";
import { getDateRange } from "../utils/dateRange.js";

export const previewTripRoutes = async (req, res) => {
  const { startLocation, endLocation } = req.body;

  const routes = await getRouteOptionsFromORS(
    startLocation,
    endLocation
  );

  res.json({ routeOptions: routes });
};


export const planTrip = async (req, res) => {
  const {
    vehicleId,
    driverId,
    startLocation,
    endLocation,
    selectedRouteIndex = 0,
  } = req.body;

  // 1️⃣ Validate vehicle
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  // 2️⃣ Validate driver
  const driver = await User.findById(driverId);
  if (!driver || driver.role !== "driver") {
    return res.status(400).json({ message: "Invalid driver selected" });
  }

  // 3️⃣ REAL ROUTE GENERATION (ORS)
  const routeOptions = await getRouteOptionsFromORS(
    startLocation,
    endLocation
  );

  if (!routeOptions.length) {
    return res.status(400).json({ message: "No routes found" });
  }

  // 4️⃣ Create trip
  const trip = await Trip.create({
    vehicle: vehicle._id,
    driver: driver._id,
    createdBy: req.user.id,
    startLocation,
    endLocation,
    routeOptions,
    selectedRouteIndex,
    status: "ASSIGNED",
  });

  // 5️⃣ Attach trip to vehicle
  vehicle.activeTrip = trip._id;
  await vehicle.save();

  res.status(201).json({
    message: "Trip planned and assigned successfully",
    tripId: trip._id,          // ✅ REQUIRED
    vehicleId: vehicle._id,    // optional but useful
    driverId: driver._id,      // optional but useful
    routeOptions,
  });
};

export const completeTrip = async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;

  const trip = await Trip.findById(id);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  if (trip.driver.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (trip.status !== "SYSTEM_COMPLETED") {
    return res.status(400).json({
      message: "Trip not yet completed by system",
    });
  }

  trip.status = "DRIVER_CONFIRMED";
  trip.driverConfirmed = true;
  trip.driverRemarks = remarks;
  await trip.save();


  res.json({ message: "Trip confirmed successfully" });
};

export const tripsCount = async (req, res) => {
  const { from, to } = getDateRange(req.query);

  const match = {};
  if (from && to) {
    match.createdAt = { $gte: from, $lte: to };
  }

  const data = await Trip.aggregate([
    {
      $match: {
        status: "DRIVER_CONFIRMED",
        ...(from && to && { createdAt: { $gte: from, $lte: to } })
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalTrips: { $sum: 1 },
      },
    },
  ]);


  res.json(data);
};

export const driverPerformance = async (req, res) => {
  const data = await Trip.aggregate([
    { $match: { status: "DRIVER_CONFIRMED" } },
    {
      $project: {
        driver: 1,
        distanceKm: {
          $arrayElemAt: [
            "$routeOptions.distanceKm",
            "$selectedRouteIndex",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$driver",
        tripsCompleted: { $sum: 1 },
        totalDistance: { $sum: "$distanceKm" },
      },
    },
  ]);

  res.json(data);
};

export const getTrips = async (req, res) => {
  let filter = {};

  if (req.user.role === "driver") {
    filter.driver = req.user.id;
  }

  if (req.user.role === "manager") {
    filter.createdBy = req.user.id;
  }

  const trips = await Trip.find(filter)
    .populate("vehicle", "make model licensePlate")
    .populate("driver", "name phone")
    .sort({ createdAt: -1 });

  res.json(trips);
};
