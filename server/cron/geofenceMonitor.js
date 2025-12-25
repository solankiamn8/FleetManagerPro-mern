import Vehicle from "../models/Vehicle.js";
import Geofence from "../models/Geofence.js";
import User from "../models/User.js";
import { sendGeofenceAlertEmail } from "../utils/mailer.js";
import { handleGeofenceViolation } from "../utils/geofenceAlert.js";

export const runGeofenceCheck = async () => {
  const activeVehicles = await Vehicle.find({
    activeTrip: { $ne: null },
  });

  const geofences = await Geofence.find({ active: true });

  for (const vehicle of activeVehicles) {
    let insideAnyGeofence = false;

    for (const geofence of geofences) {
      const isInside = await Vehicle.findOne({
        _id: vehicle._id,
        location: {
          $geoWithin: {
            $geometry: geofence.area,
          },
        },
      });

      

      if (isInside) {
        insideAnyGeofence = true;
        break;
      }
    }

    if (!insideAnyGeofence) {
      await handleGeofenceViolation(vehicle);
    }
  }
};
