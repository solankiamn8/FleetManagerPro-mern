import { Router } from 'express';
import { auth, permit } from '../middleware/auth.js';
import { requirePhoneVerified } from "../middleware/requirePhoneVerified.js";
import { createMaintenanceSchedule } from '../controllers/maintenanceController.js';

const router = Router();

router.post(
  "/schedule",
  auth,
  permit("admin", "manager"),
  requirePhoneVerified,
  createMaintenanceSchedule
);

export default router;
