import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import { sendMaintenanceAlertEmail } from "../utils/mailer.js";

export const runMaintenanceMonitor = async () => {
  const schedules = await MaintenanceSchedule.find({ active: true })
    .populate("vehicle");

  for (const s of schedules) {
    if (!s.vehicle) continue;

    // 🛑 Prevent alert spam (1 per day max)
    if (
      s.lastNotifiedAt &&
      Date.now() - s.lastNotifiedAt.getTime() < 24 * 60 * 60 * 1000
    ) {
      continue;
    }

    let due = false;

    if (s.dueAtDate && new Date() >= s.dueAtDate) {
      due = true;
    }

    if (s.dueAtMileage && s.vehicle.mileage >= s.dueAtMileage) {
      due = true;
    }

    if (!due) continue;

    // 📧 Send alert
    await sendMaintenanceAlertEmail({
      vehicle: s.vehicle,
      type: s.type,
    });

    // ✅ Update last notified time
    s.lastNotifiedAt = new Date();
    await s.save();
  }
};
