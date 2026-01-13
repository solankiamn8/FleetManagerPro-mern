// src/pages/vehicles/VehicleRow.jsx
import { useState } from "react"
import AssignDriverModal from "./AssignDriverModal"

export default function VehicleRow({ vehicle, onRefresh }) {
  const [showAssign, setShowAssign] = useState(false)

  const statusColor = {
    ACTIVE: "bg-green-500/20 text-green-400",
    MAINTENANCE: "bg-yellow-500/20 text-yellow-400",
    IDLE: "bg-gray-500/20 text-yellow-400",
  }

  return (
    <>
      <tr className="border-t border-white/5 hover:bg-white/5 transition">
        <td className="px-4 py-3 font-medium">
          {vehicle.make} {vehicle.model}
        </td>

        <td className="px-4 py-3">
          <span className="
    inline-flex items-center 
    bg-gray-100 text-black 
    rounded-sm
    font-bold font-mono tracking-widest text-sm
    border-[1.5px] border-black
    ring-1 ring-white ring-offset-0 /* This creates the thin white 'margin' visibility */
    shadow-sm
    overflow-hidden
  ">
            {/* Blue 'IND' Section - Tightened spacing */}
            <span className="flex flex-col items-center justify-center px-0.5 py-0.5 bg-gray-50 border-r border-gray-300 leading-none">
              <div className="w-2 h-2 bg-blue-700 mb-0.5 rounded-[1px]"></div> {/* Square Logo */}
              <span className="text-[7px] font-sans font-extrabold text-blue-800 scale-90">IND</span>
            </span>

            {/* Plate Number */}
            <span className="px-2 py-1 uppercase whitespace-nowrap">
              {vehicle.licensePlate}
            </span>
          </span>
        </td>


        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded-full uppercase text-xs ${statusColor[vehicle.status]}`}>
            {vehicle.status}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-300">
          {vehicle.assignedDriver
            ? vehicle.assignedDriver.name
            : <span className="text-red-400">NOT ASSIGNED</span>}
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
