import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import {
  getAlerts,
  markAlertResolved,
} from "../controllers/alertController.js";

const router = Router();

// Only managers & admins
router.use(auth, permit("admin", "manager"));

// View alerts
router.get("/", getAlerts);

// Resolve alert
router.patch("/:id/resolve", markAlertResolved);

export default router;
