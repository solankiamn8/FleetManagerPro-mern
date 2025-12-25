import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet"
import { useState } from "react"

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })
  return null
}

export default function MapPicker({
  start,
  end,
  onStartSelect,
  onEndSelect,
  routes = [],
  selectedRouteIndex,
}) {
  const [mode, setMode] = useState("start") // start | end

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("start")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "start" ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10"
          }`}
        >
          📍 Pick Start
        </button>
        <button
          onClick={() => setMode("end")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "end" ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10"
          }`}
        >
          🏁 Pick End
        </button>
      </div>

      {/* Map */}
      <div className="h-[420px] rounded-xl overflow-hidden border border-white/10">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler
            onSelect={(coords) =>
              mode === "start" ? onStartSelect(coords) : onEndSelect(coords)
            }
          />

          {start && <Marker position={[start.lat, start.lng]} />}
          {end && <Marker position={[end.lat, end.lng]} />}

          {/* Route preview */}
          {routes.map((route, idx) => (
            <Polyline
              key={idx}
              positions={route.polyline.map(p => [p.lat, p.lng])}
              pathOptions={{
                color: idx === selectedRouteIndex ? "#22d3ee" : "#64748b",
                weight: idx === selectedRouteIndex ? 5 : 3,
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
