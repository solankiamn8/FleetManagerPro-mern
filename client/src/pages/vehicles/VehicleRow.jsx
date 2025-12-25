// src/pages/vehicles/VehicleRow.jsx
import { useState } from "react"
import AssignDriverModal from "./AssignDriverModal"

export default function VehicleRow({ vehicle, onRefresh }) {
  const [showAssign, setShowAssign] = useState(false)

  const statusColor = {
    active: "bg-green-500/20 text-green-400",
    maintenance: "bg-yellow-500/20 text-yellow-400",
    inactive: "bg-gray-500/20 text-gray-400",
  }

  return (
    <>
      <tr className="border-t border-white/5 hover:bg-white/5 transition">
        <td className="px-4 py-3 font-medium">
          {vehicle.make} {vehicle.model}
        </td>

        <td className="px-4 py-3 text-gray-300">
          {vehicle.licensePlate}
        </td>

        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded text-xs ${statusColor[vehicle.status]}`}>
            {vehicle.status}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-300">
          {vehicle.assignedDriver
            ? vehicle.assignedDriver.name
            : <span className="text-red-400">Unassigned</span>}
        </td>

        <td className="px-4 py-3 text-gray-300">
          {vehicle.mileage.toLocaleString()} km
        </td>

        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setShowAssign(true)}
            className="text-cyan-400 hover:underline text-xs"
          >
            Assign Driver
          </button>
        </td>
      </tr>

      {showAssign && (
        <AssignDriverModal
          vehicle={vehicle}
          onClose={() => {
            setShowAssign(false)
            onRefresh()
          }}
        />
      )}
    </>
  )
}
