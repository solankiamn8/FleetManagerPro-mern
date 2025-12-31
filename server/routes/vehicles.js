// routes/vehicleRoutes.js
import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";
import {
  createVehicle,
  assignDriverToVehicle,
  getVehicles, // 👈 ADD
} from "../controllers/vehicleController.js";

const router = Router();

// ✅ Get all vehicles (Admin / Manager / Driver)
router.get("/", auth, permit("admin", "manager", "driver"), getVehicles);

// ✅ Create vehicle
router.post("/", auth, permit("admin", "manager"), requirePhoneVerified, createVehicle);

// ✅ Assign driver
router.post("/assign", auth, permit("admin", "manager"), requirePhoneVerified, assignDriverToVehicle);

export default router;
