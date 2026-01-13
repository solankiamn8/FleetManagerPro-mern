// src/pages/vehicles/Vehicles.jsx
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

import PageHeader from "../../components/common/PageHeader"
import VehicleTable from "./VehicleTable"
import AddVehicleInline from "./AddVehicleInline"

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const res = await api.get("/vehicles")
      setVehicles(res.data)
    } catch {
      toast.error("Failed to load vehicles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        subtitle="Manage fleet vehicles and driver assignments"
      />

      {/* Inline Add */}
      {showAdd && (
        <AddVehicleInline
          onCancel={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false)
            fetchVehicles()
          }}
        />
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="ui-btn-primary"
        >
          {showAdd ? "Close" : "+ Add Vehicle"}
        </button>
      </div>

      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        onRefresh={fetchVehicles}
      />
    </div>
  )
}
