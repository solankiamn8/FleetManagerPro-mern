// src/pages/vehicles/AssignDriverModal.jsx
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

export default function AssignDriverModal({ vehicle, onClose }) {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [loading, setLoading] = useState(false)

  // 🔹 Fetch real drivers
  useEffect(() => {
    api.get("/users/drivers")
      .then(res => setDrivers(res.data))
      .catch(() => toast.error("Failed to load drivers"))
  }, [])

  const assignDriver = async () => {
    if (!selectedDriver) return

    try {
      setLoading(true)
      await api.post("/vehicles/assign", {
        vehicleId: vehicle._id,
        driverId: selectedDriver._id,
      })

      toast.success("Driver assigned successfully")
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#020617] border border-white/10 rounded-xl p-6 w-full max-w-lg">

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Assign Driver</h3>
          <p className="text-sm text-gray-400">
            Vehicle:{" "}
            <span className="text-white">
              {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
            </span>
          </p>
        </div>

        {/* Driver list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {drivers.map(driver => {
            const selected = selectedDriver?._id === driver._id

            return (
              <button
                key={driver._id}
                onClick={() => setSelectedDriver(driver)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition
                  ${selected ? "border-cyan-400 bg-cyan-500/10" : "border-white/10"}
                  hover:bg-white/5
                `}
              >
                <div>
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-xs text-gray-400">
                    {driver.phone?.number || "No phone"}
                  </div>
                </div>

                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                  Available
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-300">
            Cancel
          </button>

          <button
            onClick={assignDriver}
            disabled={!selectedDriver || loading}
            className="btn-grad px-4 py-2 disabled:opacity-40"
          >
            Assign Driver
          </button>
        </div>
      </div>
    </div>
  )
}
