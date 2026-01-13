import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { getTeamActivity } from "../controllers/activityController.js";
const router = Router();

router.get("/", auth, permit("manager"), getTeamActivity)

export default router;
