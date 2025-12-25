import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";
import {
  planTrip,
  completeTrip,
  getTrips,
  previewTripRoutes,          // 👈 ADD THIS
} from "../controllers/tripController.js";

const router = Router();

// GET Trips
router.get(
  "/",
  auth,
  getTrips
);

// Generate Routes
router.post(
  "/preview",
  auth,
  permit("admin", "manager"),
  requirePhoneVerified,
  previewTripRoutes
);

router.post(
  "/plan",
  auth,
  permit("admin", "manager"),
  requirePhoneVerified,
  planTrip
);

router.post(
  "/:id/complete",
  auth,
  permit("driver"),
  completeTrip
);

export default router;
