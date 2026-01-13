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

// ---------------- INVITE EMAIL ----------------
export const sendInviteEmail = async ({
  to,
  inviteLink,
  role,
  orgName,
  invitedByName,
  invitedByEmail,
}) => {
  await transporter.sendMail({
    from: `"FleetManagerPro" <${env.MAIL_USER}>`,
    to,
    subject: `Invitation to join ${orgName} on FleetManagerPro`,
    html: `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f9fafb;
      padding: 40px 16px;
      text-align: center;
    ">

      <div style="
        max-width: 560px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 14px;
        padding: 36px 28px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.08);
      ">

        <!-- LOGO -->
        <div style="
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 18px;
          color: #020617;
        ">
          FleetManager<span style="color:#22d3ee;">PRO</span>
        </div>

        <h2 style="margin: 0 0 14px; color: #020617;">
          You’ve been invited 🎉
        </h2>

        <p style="color: #374151; font-size: 15px; margin-bottom: 12px;">
          <strong>${invitedByName}</strong> invited you to join
          <strong>${orgName}</strong> on FleetManagerPro
          as a <strong>${role.toUpperCase()}</strong>.
        </p>

        <p style="color: #6b7280; font-size: 14px; margin-bottom: 22px;">
          This invitation was sent to<br />
          <strong>${to}</strong>
        </p>

        <!-- CTA -->
        <a href="${inviteLink}"
          style="
            display: inline-block;
            background: linear-gradient(90deg, #22d3ee, #3b82f6);
            color: white;
            padding: 14px 26px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 24px;
          ">
          Accept Invitation
        </a>

        <p style="color: #6b7280; font-size: 13px; margin-top: 18px;">
          ⏳ This invite expires in 24 hours
        </p>

        <hr style="margin: 28px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="font-size: 13px; color: #6b7280;">
          Questions? Reach out to<br />
          <strong>${invitedByName}</strong><br />
          <a href="mailto:${invitedByEmail}" style="color:#2563eb;">
            ${invitedByEmail}
          </a>
        </p>

        <p style="font-size: 12px; color: #9ca3af; margin-top: 22px;">
          FleetManagerPro · Smart Fleet Operations
        </p>
      </div>
    </div>
    `,
  })
};

export const sendAccountStatusEmail = async ({
  to,
  status,
  orgName,
  managerName,
}) => {
  const isSuspended = status === "suspended"

  await transporter.sendMail({
    from: `"FleetManagerPro" <${env.MAIL_USER}>`,
    to,
    subject: `Account ${isSuspended ? "Suspended" : "Reactivated"} – ${orgName}`,
    html: `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f9fafb;
      padding: 40px 16px;
      text-align: center;
    ">
      <div style="
        max-width: 560px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 14px;
        padding: 36px 28px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.08);
      ">

        <div style="
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 18px;
          color: #020617;
        ">
          FleetManager<span style="color:#22d3ee;">PRO</span>
        </div>

        <h2 style="color:#020617; margin-bottom: 14px;">
          Account ${isSuspended ? "Suspended 🔒" : "Reactivated ✅"}
        </h2>

        <p style="color:#374151; font-size:15px; margin-bottom: 16px;">
          Your account at <strong>${orgName}</strong>
          has been ${isSuspended ? "temporarily suspended" : "reactivated"}.
        </p>

        <p style="color:#6b7280; font-size:14px;">
          Actioned by <strong>${managerName}</strong>
        </p>

        ${isSuspended
        ? `<p style="color:#9ca3af; font-size:13px; margin-top: 18px;">
                You will not be able to access fleet features until reactivated.
               </p>`
        : `<p style="color:#16a34a; font-size:13px; margin-top: 18px;">
                You now have full access again.
               </p>`
      }

        <hr style="margin: 28px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="font-size:12px; color:#9ca3af;">
          FleetManagerPro · Smart Fleet Operations
        </p>
      </div>
    </div>
    `,
  })
}

