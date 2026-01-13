import { useEffect, useState } from "react"
import api from "../../api/axios"
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    Popup,
} from "react-leaflet"
import {
    movingIcon,
    idleIcon,
    maintenanceIcon,
} from "@/components/map/markers"

const iconByStatus = {
    ACTIVE: movingIcon,
    IDLE: idleIcon,
    MAINTENANCE: maintenanceIcon,
}

export default function LiveTracking() {
    const [vehicles, setVehicles] = useState([])

    useEffect(() => {
        const fetchVehicles = async () => {
            const res = await api.get("/tracking/vehicles/all")
            setVehicles(res.data)
        }

        fetchVehicles()
        const interval = setInterval(fetchVehicles, 5000)
        return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev =>
                prev.map(v => {
                    // 🛑 1. No active trip → don’t move
                    if (!v.activeTrip) return v

                    // 🛑 2. No route data → don’t move
                    const route =
                        v.activeTrip.routeOptions?.[
                        v.activeTrip.selectedRouteIndex
                        ]

                    if (!route || !route.polyline?.length) return v

                    const nextIndex = Math.min(
                        (v.activeTrip.currentRouteIndex ?? 0) + 1,
                        route.polyline.length - 1
                    )

                    const nextPoint = route.polyline[nextIndex]

                    return {
                        ...v,
                        location: {
                            ...v.location,
                            coordinates: [nextPoint.lng, nextPoint.lat],
                        },
                        activeTrip: {
                            ...v.activeTrip,
                            currentRouteIndex: nextIndex,
                        },
                    }
                })
            )

        }, 3000)

        return () => clearInterval(interval)
    }, [])



    return (
        <div className="h-[calc(100vh-80px)] rounded-xl overflow-hidden border border-white/10">
            <MapContainer
                center={[28.6139, 77.2090]}
                zoom={12}
                className="h-full w-full"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {vehicles.map(v => {
                    const route =
                        v.activeTrip?.routeOptions?.[
                        v.activeTrip?.selectedRouteIndex ?? 0
                        ]

                    return (
                        <div key={v._id}>
                            <Marker
                                position={[
                                    v.location.coordinates[1],
                                    v.location.coordinates[0],
                                ]}
                                icon={iconByStatus[v.status] ?? idleIcon}
                            >
                                <Popup>
                                    <div className="space-y-1">
                                        <div className="font-semibold">
                                            {v.licensePlate}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Driver: {v.assignedDriver?.name ?? "Unassigned"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Status: {v.status}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Draw route ONLY if active */}
                            {route?.polyline?.length > 0 && (
                                <Polyline
                                    positions={route.polyline.map(p => [p.lat, p.lng])}
                                    pathOptions={{
                                        color: "#22d3ee",
                                        weight: 4,
                                        opacity: 0.6,
                                    }}
                                />
                            )}
                        </div>
                    )
                })}

            </MapContainer>
        </div>
    )
}
