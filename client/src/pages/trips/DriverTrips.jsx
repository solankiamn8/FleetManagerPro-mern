// src/pages/trips/DriverTrips.jsx
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

export default function DriverTrips() {
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    api.get("/trips/my")
      .then(res => setTrip(res.data))
      .catch(() => toast.error("No active trip"))
  }, [])

  const startTrip = async () => {
    await api.post(`/trips/${trip._id}/start`)
    toast.success("Trip started")
    window.location.reload()
  }

  const completeTrip = async () => {
    await api.post(`/trips/${trip._id}/complete`, {
      remarks: "Trip completed successfully",
    })
    toast.success("Trip completed")
    window.location.reload()
  }

  if (!trip) return <p>No assigned trip</p>

  return (
    <div className="bg-[#020617] border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold mb-2">🚚 Active Trip</h3>

      <p className="text-gray-400 text-sm mb-4">
        {trip.routeOptions[trip.selectedRouteIndex].distanceKm} km •{" "}
        {trip.routeOptions[trip.selectedRouteIndex].estimatedTimeMin} min
      </p>

      {trip.status === "ASSIGNED" && (
        <button onClick={startTrip} className="btn-grad px-4 py-2">
          Start Trip
        </button>
      )}

      {trip.status === "SYSTEM_COMPLETED" && (
        <button onClick={completeTrip} className="btn-grad px-4 py-2">
          Complete Trip
        </button>
      )}
    </div>
  )
}
