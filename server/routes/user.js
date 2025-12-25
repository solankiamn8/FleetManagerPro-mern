import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import {
  getDrivers,
  submitPhoneNumber,
  verifyPhoneOTP,
} from "../controllers/userController.js";

const router = Router();

router.post("/phone", auth, submitPhoneNumber);
router.post("/phone/verify", auth, verifyPhoneOTP);
router.get(
  "/drivers",
  auth,
  permit("admin", "manager"),
  getDrivers
)


export default router;
