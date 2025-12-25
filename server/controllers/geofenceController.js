import Geofence from "../models/Geofence.js";

export const createGeofence = async (req, res) => {
  const { name, coordinates } = req.body;

  // coordinates: [[[lng, lat], [lng, lat], ...]]
  const geofence = await Geofence.create({
    name,
    area: {
      type: "Polygon",
      coordinates,
    },
    createdBy: req.user.id,
  });

  res.status(201).json({
    message: "Geofence created successfully",
    geofence,
  });
};
