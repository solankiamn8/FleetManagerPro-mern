import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// ✅ ONE transporter, reused everywhere
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

// ---------------- OTP EMAIL ----------------
export const sendOTPEmail = async ({ to, otp }) => {
  await transporter.sendMail({
    from: `"FleetManagerPro" <${env.MAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
};

// ---------------- GEOFENCE ALERT ----------------
export const sendGeofenceAlertEmail = async ({ to, trip, vehicle }) => {
  await transporter.sendMail({
    from: `"FleetManagerPro" <${env.MAIL_USER}>`,
    to,
    subject: "🚨 Geofence Breach Alert",
    text: `
Vehicle: ${vehicle.licensePlate}

Driver: ${trip.driver.name}
Phone: ${trip.driver.phone?.number || "Not provided"}
Email: ${trip.driver.email}

Last Location:
Lat: ${vehicle.location.coordinates[1]}
Lng: ${vehicle.location.coordinates[0]}
`,
  });
};

// ---------------- MAINTENANCE ALERT ----------------
export const sendMaintenanceAlertEmail = async ({ vehicle, type }) => {
  await transporter.sendMail({
    from: `"FleetManagerPro" <${env.MAIL_USER}>`,
    to: env.MAIL_USER, // later: manager email
    subject: "🛠 Maintenance Due Alert",
    text: `
Maintenance Required

Vehicle: ${vehicle.licensePlate}
Type: ${type}

Please schedule service as soon as possible.
`,
  });
};
