// src/pages/trips/DriverTrips.jsx
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

export default function DriverTrips() {
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTrip = async () => {
    try {
      const res = await api.get("/trips/active")
      setTrip(res.data)
    } catch {
      toast.error("Failed to load trips")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrip()
  }, [])

  const startTrip = async () => {
    try {
      await api.post(`/trips/${trip._id}/start`)
      toast.success("Trip started")
      fetchTrip()
    } catch {
      toast.error("Failed to start trip")
    }
  }

  const completeTrip = async () => {
    try {
      await api.post(`/trips/${trip._id}/complete`, {
        remarks: "Trip completed successfully",
      })
      toast.success("Trip completed")
      fetchTrip()
    } catch {
      toast.error("Failed to complete trip")
    }
  }

  if (loading) return <p className="text-gray-400">Loading active trip…</p>
  if (!trip) return <p>No assigned trip</p>

  return (
    <div className="bg-[#020617] border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold mb-2">🚚 Active Trip</h3>

      <p className="text-gray-400 text-sm mb-4">
        {trip.routeOptions[trip.selectedRouteIndex].distanceKm} km •{" "}
        {trip.routeOptions[trip.selectedRouteIndex].estimatedTimeMin} min
      </p>

      {trip.status === "QUEUED" && (
        <button onClick={startTrip} className="btn-grad px-4 py-2">
          Start Trip
        </button>
      )}

      {trip.status === "IN_PROGRESS" && (
        <p className="text-green-400 text-sm">
          🟢 Trip in progress…
        </p>
      )}

      {trip.status === "SYSTEM_COMPLETED" && (
        <button onClick={completeTrip} className="btn-grad px-4 py-2">
          Complete Trip
        </button>
      )}
    </div>
  )
}
