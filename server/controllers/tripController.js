import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import { getRouteOptionsFromORS } from "../utils/ors.js";
import { getDateRange } from "../utils/dateRange.js";

const ACTIVE_STATUSES = [
  "ASSIGNED",
  "IN_PROGRESS",
  "SYSTEM_COMPLETED",
];

export const previewTripRoutes = async (req, res) => {
  try {
    const { startLocation, endLocation } = req.body;

    const routes = await getRouteOptionsFromORS(startLocation, endLocation);

    if (!routes.length) {
      return res.status(400).json({
        message: "Route too long or not supported",
        routeOptions: [],
      });
    }

    res.json({ routeOptions: routes });
  } catch (err) {
    console.error("Preview trip error:", err);
    res.status(500).json({ message: "Failed to preview routes" });
  }
};

export const planTrip = async (req, res) => {
  try {
    const {
      vehicleId,
      driverId,
      startLocation,
      endLocation,
      selectedRouteIndex = 0,
    } = req.body;

    // 1️⃣ Validate vehicle (ORG-SAFE)
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      organization: req.user.organization,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Active trip check
    const activeTripCount = await Trip.countDocuments({
      vehicle: vehicle._id,
      status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
    });

    if (activeTripCount >= 1) {
      return res.status(400).json({
        message: "Vehicle already has an active trip",
      });
    }

    // Planned trip check
    const plannedTripCount = await Trip.countDocuments({
      vehicle: vehicle._id,
      status: "PLANNED",
    });

    if (vehicle.status === "ACTIVE" && plannedTripCount >= 1) {
      return res.status(400).json({
        message: "Vehicle already has a queued trip",
      });
    }


    // 2️⃣ Validate driver (ORG-SAFE)
    const driver = await User.findOne({
      _id: driverId,
      role: "driver",
      organization: req.user.organization,
    });

    if (!driver) {
      return res.status(400).json({ message: "Invalid driver selected" });
    }

    // 🚫 Driver already busy
    const driverBusy = await Trip.exists({
      driver: driver._id,
      organization: req.user.organization,
      status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
    });

    if (driverBusy) {
      return res.status(400).json({
        message: "Driver already has an active trip",
      });
    }

    // 3️⃣ ORS routes
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
      organization: req.user.organization,
      startLocation,
      endLocation,
      routeOptions,
      selectedRouteIndex,
      status: "ASSIGNED",
    });

    // 5️⃣ Lock vehicle
    await vehicle.save();

    res.status(201).json({
      message: "Trip planned successfully",
      tripId: trip._id,
    });
  } catch (err) {
    console.error("Plan trip error:", err);
    res.status(500).json({ message: "Failed to plan trip" });
  }
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
        organization: req.user.organization,
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
    {
      $match: {
        status: "DRIVER_CONFIRMED", organization: req.user.organization
      }
    },
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
  let filter = {
    organization: req.user.organization,
  };

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

export const getActiveDriverTrip = async (req, res) => {
  const trip = await Trip.findOne({
    driver: req.user.id,
    organization: req.user.organization,
    status: { $in: ["ASSIGNED", "IN_PROGRESS", "SYSTEM_COMPLETED"] },
  })
    .populate("vehicle", "make model licensePlate")
    .sort({ createdAt: -1 });

  res.json(trip || null);
};
