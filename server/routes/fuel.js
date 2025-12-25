import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { addFuelLog } from "../controllers/fuelController.js";
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";


const router = Router();

router.post(
  "/log",
  auth,
  permit("driver"),
  requirePhoneVerified,
  addFuelLog
);

export default router;
