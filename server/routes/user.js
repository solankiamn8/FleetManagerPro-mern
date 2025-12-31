import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import {
  getDriverById,
  getDrivers,
  getDriversWithStats,
  submitPhoneNumber,
  verifyPhoneOTP,
} from "../controllers/userController.js";

const router = Router();

router.post("/phone-number", auth, submitPhoneNumber);
router.post("/phone-number/verify", auth, verifyPhoneOTP);
router.get("/drivers", auth, permit("admin", "manager"), getDrivers);
router.get("/drivers/stats", auth, permit("admin", "manager"), getDriversWithStats);
router.get("/drivers/:id", auth, permit("admin", "manager"), getDriverById)



export default router;
