import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"
import MapPicker from "./MapPicker"
import RouteSelector from "./RouteSelector"
import LocationSearch from "../../components/map/LocationSearch"
import { ArrowPathIcon } from "@heroicons/react/24/outline"



export default function TripPlanner({ onRouteReady }) {
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(0)
  const [activeField, setActiveField] = useState(null); // "start" | "end" | null


  const debounceRef = useRef(null)

  // 🔄 Auto-generate routes
  useEffect(() => {
    if (!start || !end) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.post("/trips/previews", {
          startLocation: start,
          endLocation: end,
        })
        setRoutes(res.data.routeOptions);
        setSelectedRoute(0);

        onRouteReady({
          start,
          end,
          routes: res.data.routeOptions,
          selectedRouteIndex: 0,
        });

      } catch {
        toast.error("Failed to generate routes")
      }
    }, 600)

    return () => clearTimeout(debounceRef.current)
  }, [start, end])

  const swapLocations = () => {
    setStart(end)
    setEnd(start)
  }

  return (
    <div className="space-y-5">
      {/* Search UI */}
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        <LocationSearch
          label="Start"
          value={start}
          onSelect={setStart}
          active={activeField == "start"}
          onFocus={() => setActiveField("start")}
          onBlur={() => setActiveField(null)}
          className="flex-1"
          hint="Search by city or locality only. Street-level addresses may not work."
        />

        <LocationSearch
          label="End"
          value={end}
          onSelect={setEnd}
          active={activeField === "end"}
          onFocus={() => setActiveField("end")}
          onBlur={() => setActiveField(null)}
          className="flex-1"
          hint="Search by city or locality only. Street-level addresses may not work."
        />



        <button
          onClick={swapLocations}
          className="hidden lg:flex group items-center justify-center
             h-[42px] w-10
             rounded-lg border border-white/20
             hover:bg-white/10 transition"
        >

          <ArrowPathIcon
            className="w-5 h-5 text-cyan-300 transition-transform duration-300 group-hover:rotate-180"
          />
        </button>

      </div>


      {/* Map */}
      <MapPicker
        start={start}
        end={end}
        onStartSelect={setStart}
        onEndSelect={setEnd}
        routes={routes}
        selectedRouteIndex={selectedRoute}
      />

      {/* Routes */}
      {routes.length > 0 && (
        <>
          <RouteSelector
            routes={routes}
            selected={selectedRoute}
            onSelect={setSelectedRoute}
          />
        </>
      )}
    </div>
  )
}

