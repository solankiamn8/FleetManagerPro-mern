// routes/inviteRoutes.js
import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import { inviteUser, acceptInvite, getInvites, revokeInvite, resendInvite } from "../controllers/inviteController.js";

const router = Router();

// GET
router.get("/", auth, permit("manager"), getInvites);

// POST
router.post("/", auth, permit("manager"), inviteUser);
router.post("/accept", acceptInvite);
router.post("/:id/resend", auth, permit("manager"), resendInvite);


// DELETE
router.delete("/:id", auth, permit("manager"), revokeInvite);


export default router;
