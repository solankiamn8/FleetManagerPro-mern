import MaintenanceLog from "../models/MaintenanceLog.js";
import MaintenanceSchedule from "../models/MaintenanceSchedule.js";

export const createMaintenanceSchedule = async (req, res) => {
  const { vehicleId, type, dueAtDate, dueAtMileage } = req.body;

  const schedule = await MaintenanceSchedule.create({
    vehicle: vehicleId,
    type,
    dueAtDate,
    dueAtMileage,
  });

  res.status(201).json({
    message: "Maintenance scheduled",
    schedule,
  });
};

export const logMaintenance = async (req, res) => {
  const { vehicleId, scheduleId, type, cost, notes } = req.body;

  const log = await MaintenanceLog.create({
    vehicle: vehicleId,
    schedule: scheduleId,
    type,
    cost,
    notes,
  });

  // close schedule
  if (scheduleId) {
    await MaintenanceSchedule.findByIdAndUpdate(scheduleId, {
      active: false,
    });
  }

  res.status(201).json({
    message: "Maintenance logged",
    log,
  });
};

export const maintenanceCostOverTime = async (req, res) => {
  const data = await MaintenanceLog.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$servicedAt" },
          month: { $month: "$servicedAt" },
        },
        totalCost: { $sum: "$cost" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json(data);
};

export const maintenanceByVehicle = async (req, res) => {
  const data = await MaintenanceLog.aggregate([
    {
      $group: {
        _id: "$vehicle",
        totalMaintenanceCost: { $sum: "$cost" },
      },
    },
  ]);

  res.json(data);
};

export const fuelVsMaintenance = async (req, res) => {
  const fuel = await FuelLog.aggregate([
    { $group: { _id: null, total: { $sum: "$totalCost" } } },
  ]);

  const maintenance = await MaintenanceLog.aggregate([
    { $group: { _id: null, total: { $sum: "$cost" } } },
  ]);

  res.json({
    fuel: fuel[0]?.total || 0,
    maintenance: maintenance[0]?.total || 0,
  });
};
