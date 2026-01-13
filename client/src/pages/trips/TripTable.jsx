// src/pages/trips/TripTable.jsx
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"
import TripRow from "./TripRow"
import { useMemo } from "react"

export default function TripTable({ refreshKey, onlyActive }) {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        api.get("/trips", { headers: { "Cache-Control": "no-cache" } })
            .then(res => setTrips(res.data))
            .catch(() => toast.error("Failed to load trips"))
            .finally(() => setLoading(false))
    }, [refreshKey])

    const filteredTrips = useMemo(() => {
        if (!onlyActive) return trips

        return trips.filter(t =>
            ["QUEUED", "IN_PROGRESS", "SYSTEM_COMPLETED"].includes(t.status)
        )
    }, [trips, onlyActive])


    if (loading) return <p className="text-gray-400">Loading trips...</p>
    if (!trips.length) return <p className="text-gray-400">No trips found</p>

    return (
        <div className="bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-[#020617] text-gray-400">
                    <tr>
                        <th className="px-4 py-3 text-left">Vehicle</th>
                        <th className="px-4 py-3">Driver</th>
                        <th className="px-4 py-3">Distance</th>
                        <th className="px-4 py-3">ETA</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTrips.map(trip => (
                        <TripRow key={trip._id} trip={trip} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
