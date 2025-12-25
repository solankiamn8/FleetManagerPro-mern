// src/components/navigation/navConfig.js

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/app",
    roles: ["admin", "manager", "driver"],
    icon: "🏠",
  },

  // MANAGER / ADMIN
  {
    label: "Vehicles",
    path: "/app/vehicles",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: "🚚",
  },
  {
    label: "Drivers",
    path: "/app/drivers",
    roles: ["admin", "manager"],
    icon: "👤",
  },
  {
    label: "Trips",
    path: "/app/trips",
    roles: ["admin", "manager", "driver"],
    requiresPhone: true, // planning + start
    icon: "🧭",
  },
  {
    label: "Live Tracking",
    path: "/app/tracking",
    roles: ["admin", "manager", "driver"],
    icon: "📡",
  },
  {
    label: "Maintenance",
    path: "/app/maintenance",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: "🛠️",
  },
  {
    label: "Geofence",
    path: "/app/geofence",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: "📍",
  },
  {
    label: "Reports",
    path: "/app/reports",
    roles: ["admin", "manager"],
    icon: "📊",
  },
  {
    label: "Alerts",
    path: "/app/alerts",
    roles: ["admin", "manager"],
    icon: "🚨",
  },

  // DRIVER ONLY
  {
    label: "Fuel Logs",
    path: "/app/fuel",
    roles: ["driver"],
    requiresPhone: true,
    icon: "⛽",
  },
]
