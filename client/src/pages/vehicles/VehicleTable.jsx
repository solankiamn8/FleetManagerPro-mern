// src/pages/vehicles/VehicleTable.jsx
import VehicleRow from "./VehicleRow"

export default function VehicleTable({ vehicles, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="text-gray-400 text-sm p-4">
        Loading vehicles...
      </div>
    )
  }

  if (!vehicles.length) {
    return (
      <div className="text-gray-400 text-sm p-4">
        No vehicles found
      </div>
    )
  }

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#020617] text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">Vehicle</th>
            <th className="px-4 py-3 text-left">License</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Driver</th>
            <th className="px-4 py-3 text-left">Mileage</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map(vehicle => (
            <VehicleRow
              key={vehicle._id}
              vehicle={vehicle}
              onRefresh={onRefresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
