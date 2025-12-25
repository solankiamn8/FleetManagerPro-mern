import cron from "node-cron";
import { runTrackingSimulation } from "./trackingSimulator.js";
import { runGeofenceCheck } from "./geofenceMonitor.js";
import { runMaintenanceMonitor } from "./maintenanceMonitor.js";

export default function startCronJobs() {
  // 🚗 Vehicle movement (frequent)
  cron.schedule("*/5 * * * * *", runTrackingSimulation);

  // 📍 Geofence checks
  cron.schedule("*/10 * * * * *", runGeofenceCheck);

  // 🛠 Maintenance checks (once daily at 6 AM)
  cron.schedule("0 6 * * *", runMaintenanceMonitor);
}
