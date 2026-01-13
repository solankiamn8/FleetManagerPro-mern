// src/components/navigation/navConfig.js
// navConfig.js
import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  UserIcon,
  MapIcon,
  SignalIcon,
  WrenchIcon,
  MapPinIcon,
  ChartBarIcon,
  BellAlertIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/app",
    roles: ["admin", "manager", "driver"],
    icon: HomeIcon,
  },
  {
    label: "Team Members",
    path: "/app/team/members",
    roles: ["manager"],
    icon: UsersIcon,
    requiresPhone: true, // 👈 yes, you can lock this
  },
  {
    label: "Invites",
    path: "/app/team/invites",
    roles: ["manager"],
    icon: EnvelopeIcon,
    requiresPhone: true,
  },
  {
    label: "Team Activity",
    path: "/app/team/activity",
    roles: ["manager"],
    icon: ClipboardDocumentListIcon,
    requiresPhone: true,
  },
  {
    label: "Vehicles",
    path: "/app/vehicles",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: TruckIcon,
  },
  {
    label: "Drivers",
    path: "/app/drivers",
    roles: ["admin", "manager"],
    icon: UserIcon,
  },
  {
    label: "Plan Trip",
    path: "/app/trips/plan",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: MapIcon,
  },
  {
    label: "Trips",
    path: "/app/trips",
    roles: ["admin", "manager", "driver"],
    requiresPhone: true,
    icon: ClipboardDocumentListIcon,
  },
  {
    label: "Live Tracking",
    path: "/app/tracking",
    roles: ["admin", "manager", "driver"],
    icon: SignalIcon,
  },
  {
    label: "Maintenance",
    path: "/app/maintenance",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: WrenchIcon,
  },
  {
    label: "Geofence",
    path: "/app/geofence",
    roles: ["admin", "manager"],
    requiresPhone: true,
    icon: MapPinIcon,
  },
  {
    label: "Reports",
    path: "/app/reports",
    roles: ["admin", "manager"],
    icon: ChartBarIcon,
  },
  {
    label: "Alerts",
    path: "/app/alerts",
    roles: ["admin", "manager"],
    icon: BellAlertIcon,
  },
  {
    label: "Fuel Logs",
    path: "/app/fuel",
    roles: ["driver"],
    requiresPhone: true,
    icon: FunnelIcon,
  },
]
