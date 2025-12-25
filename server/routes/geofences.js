import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";
import { createGeofence } from "../controllers/geofenceController.js";

const router = Router();

router.post(
  "/",
  auth,
  permit("admin", "manager"),
  requirePhoneVerified,
  createGeofence
);

export default router;
