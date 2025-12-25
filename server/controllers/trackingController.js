import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";


export const startTrip = async (req, res) => {
  const { tripId } = req.params;

  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  if (!trip.driver.equals(req.user.id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (trip.status !== "ASSIGNED") {
    return res.status(400).json({ message: "Trip cannot be started" });
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  if (vehicle.activeTrip && !vehicle.activeTrip.equals(trip._id)) {
    return res.status(400).json({
      message: "Vehicle already has an active trip",
    });
  }

  trip.status = "IN_PROGRESS";
  trip.startedAt = new Date();
  trip.currentRouteIndex = 0;

  const firstPoint =
    trip.routeOptions[trip.selectedRouteIndex].polyline[0];

  vehicle.currentLocation = firstPoint;
  vehicle.location.coordinates = [firstPoint.lng, firstPoint.lat];
  vehicle.locationUpdatedAt = new Date();
  vehicle.activeTrip = trip._id;

  await trip.save();
  await vehicle.save();

  res.json({ message: "Trip started successfully" });
};

export const getLiveVehicles = async (req, res) => {
  const vehicles = await Vehicle.find(
    { activeTrip: { $ne: null } },
    {
      licensePlate: 1,
      status: 1,
      currentLocation: 1,
      location: 1,
      assignedDriver: 1,
      activeTrip: 1,
    }
  )
    .populate({
      path: "activeTrip",
      match: { status: "IN_PROGRESS" },
      select: "driver startedAt routeOptions selectedRouteIndex"
      ,
    })
    .populate({
      path: "assignedDriver",
      select: "name phone.number",
    });

  res.json(vehicles.filter(v => v.activeTrip));
};


