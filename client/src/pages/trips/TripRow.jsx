// src/pages/trips/TripRow.jsx
export default function TripRow({ trip }) {
  const route = trip.routeOptions?.[trip.selectedRouteIndex]

  const statusColor = {
    ASSIGNED: "text-yellow-400",
    STARTED: "text-blue-400",
    SYSTEM_COMPLETED: "text-purple-400",
    DRIVER_CONFIRMED: "text-green-400",
  }

  return (
    <tr className="border-t border-white/5">
      <td className="px-4 py-3">
        {trip.vehicle?.licensePlate}
      </td>
      <td className="px-4 py-3">
        {trip.driver?.name}
      </td>
      <td className="px-4 py-3">
        {route?.distanceKm} km
      </td>
      <td className="px-4 py-3">
        {route?.estimatedTimeMin} min
      </td>
      <td className={`px-4 py-3 font-medium ${statusColor[trip.status]}`}>
        {trip.status}
      </td>
    </tr>
  )
}
