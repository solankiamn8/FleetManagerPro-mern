import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";

import {
  fuelCostOverTime,
  fuelByVehicle,
  inefficientTrips,
} from "../controllers/fuelController.js";

import {
  tripsCount,
  driverPerformance,
} from "../controllers/tripController.js";

import {
  maintenanceCostOverTime,
  maintenanceByVehicle,
  fuelVsMaintenance,
} from "../controllers/maintenanceController.js";

const router = Router();

// 🔐 Manager / Admin only
router.use(auth, permit("admin", "manager"));

// Fuel analytics
router.get("/fuel/cost", fuelCostOverTime);
router.get("/fuel/vehicle", fuelByVehicle);
router.get("/fuel/inefficient", inefficientTrips);

// Trip analytics
router.get("/trips/count", tripsCount);
router.get("/drivers/performance", driverPerformance);

// Maintenance analytics
router.get("/maintenance/cost", maintenanceCostOverTime);
router.get("/maintenance/vehicle", maintenanceByVehicle);
router.get("/maintenance/fuel-vs", fuelVsMaintenance);

export default router;
