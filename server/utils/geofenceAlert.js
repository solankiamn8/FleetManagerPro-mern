import Trip from "../models/Trip.js";
import { sendGeofenceAlertEmail } from "./mailer.js";

const violationCache = new Set(); // prevent spam

export const handleGeofenceViolation = async (vehicle) => {
  if (!vehicle.activeTrip) return;

  const key = vehicle._id.toString();
  if (violationCache.has(key)) return;

  violationCache.add(key);

  const trip = await Trip.findById(vehicle.activeTrip)
    .populate("createdBy", "name email")
    .populate("driver", "name email phone");

  if (!trip) return;

  const manager = trip.createdBy;

  console.log(
    `🚨 GEOFENCE VIOLATION: Vehicle ${vehicle.licensePlate}`
  );

  await sendGeofenceAlertEmail({
    to: manager.email,
    vehicle,
    trip,
  });
};
