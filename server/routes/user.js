import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import {
  activateUser,
  getDriverById,
  getDrivers,
  getDriversWithStats,
  getTeamMembers,
  removeUser,
  submitPhoneNumber,
  suspendUser,
  verifyPhoneOTP,
} from "../controllers/userController.js";

const router = Router();

router.post("/phone-number", auth, submitPhoneNumber);
router.post("/phone-number/verify", auth, verifyPhoneOTP);

router.get("/drivers", auth, permit("admin", "manager"), getDrivers);
router.get("/drivers/stats", auth, permit("admin", "manager"), getDriversWithStats);
router.get("/drivers/:id", auth, permit("admin", "manager"), getDriverById)

router.get("/team", auth, permit("manager"), getTeamMembers)

router.patch("/:id/suspend", auth, permit("manager"), suspendUser)
router.patch("/:id/activate", auth, permit("manager"), activateUser)
router.delete("/:id", auth, permit("manager"), removeUser)


export default router;
