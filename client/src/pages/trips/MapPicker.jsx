import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import { startIcon, endIcon } from "../../components/map/markers";

/* ---------------- Click Logic ---------------- */

function ClickHandler({ start, end, onStartSelect, onEndSelect }) {
  useMapEvents({
    click(e) {
      const point = { lat: e.latlng.lat, lng: e.latlng.lng };

      if (!start) {
        onStartSelect(point);
      } else if (!end) {
        onEndSelect(point);
      } else {
        const dStart = Math.hypot(start.lat - point.lat, start.lng - point.lng);
        const dEnd = Math.hypot(end.lat - point.lat, end.lng - point.lng);
        dStart < dEnd ? onStartSelect(point) : onEndSelect(point);
      }
    },
  });

  return null;
}

/* ---------------- Auto Pan ---------------- */

function AutoPan({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (start && end) {
      map.fitBounds(
        [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ],
        { padding: [60, 60] }
      );
    } else if (start) {
      map.setView([start.lat, start.lng], 14);
    }
  }, [start, end, map]);

  return null;
}

/* ---------------- Main Component ---------------- */

export default function MapPicker({
  start,
  end,
  onStartSelect,
  onEndSelect,
  routes,
  selectedRouteIndex,
}) {
  return (
    <MapContainer
      center={[28.6, 77.2]}
      zoom={12}
      className="h-[420px] rounded-xl border border-white/10"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ClickHandler
        start={start}
        end={end}
        onStartSelect={onStartSelect}
        onEndSelect={onEndSelect}
      />

      <AutoPan start={start} end={end} />

      {start && (
        <Marker
          position={[start.lat, start.lng]}
          icon={startIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              onStartSelect({ ...start, lat: p.lat, lng: p.lng });
            },
          }}
        />
      )}

      {end && (
        <Marker
          position={[end.lat, end.lng]}
          icon={endIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              onEndSelect({ ...end, lat: p.lat, lng: p.lng });
            },
          }}
        />
      )}

      {routes.map((r, i) => (
        <Polyline
          key={i}
          positions={r.polyline.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: i === selectedRouteIndex ? "#22d3ee" : "#64748b",
            weight: i === selectedRouteIndex ? 5 : 3,
            opacity: i === selectedRouteIndex ? 1 : 0.6,
          }}
        />
      ))}
    </MapContainer>
  );
}
