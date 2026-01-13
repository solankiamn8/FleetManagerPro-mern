import L from "leaflet"

import truck from "@/assets/map-icons/truck.svg"
import pause from "@/assets/map-icons/pause.svg"
import wrench from "@/assets/map-icons/wrench.svg"

export const movingIcon = new L.Icon({
  iconUrl: truck,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

export const idleIcon = new L.Icon({
  iconUrl: pause,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

export const maintenanceIcon = new L.Icon({
  iconUrl: wrench,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})


export const startIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

export const endIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

export const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743131.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

