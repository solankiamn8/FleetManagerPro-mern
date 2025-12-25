import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"
import MapPicker from "./MapPicker"
import RouteSelector from "./RouteSelector"

export default function TripPlanner({ vehicleId, driverId, onSuccess }) {
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(0)
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef(null)

  useEffect(() => {
    if (!start || !end) return
    if (!vehicleId || !driverId) return

    // debounce to avoid API spam
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await api.post("/trips/preview", {
          startLocation: start,
          endLocation: end,
        })
        setRoutes(res.data.routeOptions)
        setSelectedRoute(0)
      } catch {
        toast.error("Failed to generate routes")
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => clearTimeout(debounceRef.current)
  }, [start, end, vehicleId, driverId])

  const confirmTrip = async () => {
    try {
      setLoading(true)
      await api.post("/trips/plan", {
        vehicleId,
        driverId,
        startLocation: start,
        endLocation: end,
        selectedRouteIndex: selectedRoute,
      })

      toast.success("Trip planned successfully")
      onSuccess()
    } catch {
      toast.error("Trip planning failed")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6">
      <MapPicker
        start={start}
        end={end}
        onStartSelect={setStart}
        onEndSelect={setEnd}
        routes={routes}
        selectedRouteIndex={selectedRoute}
      />

      {routes.length > 0 && (
        <>
          <RouteSelector
            routes={routes}
            selected={selectedRoute}
            onSelect={setSelectedRoute}
          />

          <button
            onClick={confirmTrip}
            className="btn-grad px-4 py-2"
          >
            Confirm Trip
          </button>
        </>
      )}
    </div>
  )
}
