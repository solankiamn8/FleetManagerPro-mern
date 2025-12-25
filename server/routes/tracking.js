import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";
import {
  startTrip,
  getLiveVehicles,
} from "../controllers/trackingController.js";

const router = Router();

router.post(
  "/:tripId/start",
  auth,
  permit("driver"),
  requirePhoneVerified,
  startTrip
);

router.get(
  "/vehicles",
  auth,
  getLiveVehicles
);

export default router;
