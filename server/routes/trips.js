import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";
import {
  previewTripRoutes,
  createTrip,
  startTrip,
  completeTrip,
  cancelTrip,
  getTrips,
  getActiveDriverTrip,
} from "../controllers/tripController.js";

const router = Router();

// GET Trips
router.get(
  "/",
  auth,
  getTrips
);

router.get(
  "/active",
  auth,
  permit("driver"),
  getActiveDriverTrip
);

// Generate Routes
router.post(
  "/previews",
  auth,
  permit("admin", "manager"),
  requirePhoneVerified,
  previewTripRoutes
);

router.post(
  "/create",
  auth,
  permit("admin", "manager"),
  requirePhoneVerified,
  createTrip
);

router.post(
  "/:id/start",
  auth,
  permit("driver"),
  requirePhoneVerified,
  startTrip
);

router.post(
  "/:id/complete",
  auth,
  permit("driver"),
  completeTrip
);

router.post(
  "/:id/cancel",
  auth,
  permit("driver", "manager"),
  cancelTrip
);

export default router;
