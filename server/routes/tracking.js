import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getLiveVehicles, getAllVehiclesForTracking } from "../controllers/trackingController.js";

const router = Router();



router.get(
  "/vehicles",
  auth,
  getLiveVehicles
);

router.get(
  "/vehicles/all",
  auth,
  getAllVehiclesForTracking
);


export default router;
