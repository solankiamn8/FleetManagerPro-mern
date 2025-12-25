// src/pages/vehicles/AddVehicleModal.jsx
import { useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

export default function AddVehicleModal({ onClose }) {
  const [form, setForm] = useState({
    make: "",
    model: "",
    licensePlate: "",
    mileage: "",
    fuelEfficiency: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const saveVehicle = async () => {
    if (!form.licensePlate) {
      return toast.error("License plate is required")
    }

    try {
      setLoading(true)
      await api.post("/vehicles", {
        ...form,
        mileage: Number(form.mileage || 0),
        fuelEfficiency: Number(form.fuelEfficiency || 0),
      })

      toast.success("Vehicle added successfully")
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add vehicle")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#020617] border border-white/10 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Vehicle</h3>

        <div className="space-y-3">
          <input name="make" onChange={handleChange} className="auth-input" placeholder="Make (Toyota, Maruti, Hyundai etc.)" />
          <input name="model" onChange={handleChange} className="auth-input" placeholder="Model (Innvoa, Ertiga, Swift, etc.)" />
          <input name="licensePlate" onChange={handleChange} className="auth-input" placeholder="License Plate* ( MP19SU8923 )" />
          <input name="mileage" onChange={handleChange} className="auth-input" placeholder="Mileage ( km )" type="number" />
          <input name="fuelEfficiency" onChange={handleChange} className="auth-input" placeholder="Fuel Efficiency (km/l)" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-300">
            Cancel
          </button>
          <button
            onClick={saveVehicle}
            disabled={loading}
            className="btn-grad px-4 py-2"
          >
            Save Vehicle
          </button>
        </div>
      </div>
    </div>
  )
}
