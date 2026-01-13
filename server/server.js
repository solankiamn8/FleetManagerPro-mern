import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

// Routes
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicles.js";
import maintenanceRoutes from "./routes/maintenance.js";
import tripRoutes from "./routes/trips.js";
import reportRoutes from "./routes/reports.js";
import alertRoutes from "./routes/alerts.js";
import userRoutes from "./routes/user.js"
import trackingRoute from "./routes/tracking.js";
import fuelRoute from "./routes/fuel.js";
import geoRoutes from "./routes/geo.js"
import inviteRoutes from "./routes/invites.js"
import activityRoutes from "./routes/activity.js"

// Cron Jobs
import startCronJobs from "./cron/index.js";

const app = express();

// CORS
const allowedOrigins = env.ALLOWED_ORIGIN.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Base Route
app.get("/", (req, res) =>
  res.json({ status: "ok", service: "FleetManagerPro API" })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tracking", trackingRoute);
app.use("/api/fuel", fuelRoute);
app.use("/api/geo", geoRoutes)
app.use("/api/activity", activityRoutes)


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Error]", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Server
connectDB().then(() => {
  // Start cron jobs after DB is connected
  startCronJobs();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });

});
