// src/pages/trips/Trips.jsx
import { useState } from "react"
import PageHeader from "../../components/common/PageHeader"
import TripTable from "./TripTable"
import TripPlanner from "./TripPlanner"
import VehicleSelect from "./VehicleSelect"
import DriverSelect from "./DriverSelect"

export default function Trips() {
  const [showPlanner, setShowPlanner] = useState(false)
  const [vehicle, setVehicle] = useState(null)
  const [driver, setDriver] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)


  return (
    <div className="space-y-6">
      <PageHeader
        title="Trips"
        subtitle="Plan, assign and track fleet trips"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowPlanner(true)}
          className="btn-grad px-4 py-2"
        >
          + Plan Trip
        </button>
      </div>

      <TripTable refreshKey={refreshKey} />

      {showPlanner && (
        <div className="bg-[#020617] border border-white/10 rounded-xl p-6 space-y-6">

          {/* 1️⃣ Vehicle selection */}
          <VehicleSelect
            selected={vehicle}
            onSelect={setVehicle}
          />

          {/* 2️⃣ Driver selection (only after vehicle) */}
          {vehicle && (
            <DriverSelect
              selected={driver}
              onSelect={setDriver}
            />
          )}

          {/* 3️⃣ Trip planner (only after both selected) */}
          {vehicle && driver && (
            <TripPlanner
              vehicleId={vehicle._id}
              driverId={driver._id}
              onSuccess={() => {
                setShowPlanner(false)
                setRefreshKey(k => k + 1)
              }}
            />

          )}

          <div className="text-right">
            <button
              onClick={() => {
                setShowPlanner(false)
                setVehicle(null)
                setDriver(null)
              }}
              className="text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
