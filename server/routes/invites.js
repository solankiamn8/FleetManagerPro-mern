// routes/inviteRoutes.js
import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import {
  inviteUser,
  acceptInvite,
} from "../controllers/inviteController.js";

const router = Router();

router.post(
  "/",
  auth,
  permit("manager"),
  inviteUser
);

router.post("/accept", acceptInvite);

export default router;
