import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";

export const runTrackingSimulation = async () => {
  // Only simulate trips that are actively running
  const activeTrips = await Trip.find({ status: "IN_PROGRESS" });

  for (const trip of activeTrips) {
    const route = trip.routeOptions[trip.selectedRouteIndex]?.polyline;
    if (!route || route.length === 0) continue;

    const nextIndex = trip.currentRouteIndex + 1;
    const vehicle = await Vehicle.findById(trip.vehicle);
    if (!vehicle) continue;

    // 🏁 Trip reached destination
    if (nextIndex >= route.length) {
      trip.status = "SYSTEM_COMPLETED"; // ✅ IMPORTANT CHANGE
      trip.endedAt = new Date();
      trip.currentRouteIndex = route.length - 1;

      // Vehicle stops being live-tracked
      vehicle.activeTrip = null;
      vehicle.status = "IDLE";

      await trip.save();
      await vehicle.save();
      continue;
    }

    // 🚗 Move vehicle along route
    const nextPoint = route[nextIndex];

    vehicle.location.coordinates = [
      nextPoint.lng,
      nextPoint.lat,
    ];
    vehicle.locationUpdatedAt = new Date();

    trip.currentRouteIndex = nextIndex;

    await trip.save();
    await vehicle.save();
  }
};
