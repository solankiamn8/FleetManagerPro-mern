import { useState } from "react"
import toast from "react-hot-toast"
import api from "@/api/axios"
import { vehicleSchema } from "@/schemas/vehicleSchema"

export default function AddVehicleInline({ onCancel, onSuccess }) {
  const [form, setForm] = useState({
    make: "",
    model: "",
    licensePlate: "",
    mileage: "",
    fuelEfficiency: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    let value = e.target.value

    // 🔠 Always uppercase license plate
    if (e.target.name === "licensePlate") {
      value = value.toUpperCase()
    }

    setForm({ ...form, [e.target.name]: value })
  }

  const submit = async () => {
    const parsed = vehicleSchema.safeParse(form)
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message)
    }

    try {
      setLoading(true)
      await api.post("/vehicles", parsed.data)
      toast.success("Vehicle added")
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add vehicle")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold mb-4">Add Vehicle</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          name="make"
          value={form.make}
          onChange={handleChange}
          placeholder="Make"
          className="auth-input"
        />

        <input
          name="model"
          value={form.model}
          onChange={handleChange}
          placeholder="Model"
          className="auth-input"
        />

        <input
          name="licensePlate"
          value={form.licensePlate}
          onChange={handleChange}
          placeholder="MP19SU8923"
          className="auth-input tracking-widest font-mono"
        />

        <input
          name="mileage"
          type="number"
          inputMode="numeric"
          value={form.mileage}
          onChange={handleChange}
          placeholder="Mileage (km)"
          className="auth-input"
        />

        <select
          name="fuelEfficiency"
          value={form.fuelEfficiency}
          onChange={handleChange}
          className="auth-select"
        >
          <option value="">Fuel (km/l)</option>
          {Array.from({ length: 40 }, (_, i) => i + 5).map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onCancel} className="text-gray-400">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="ui-btn-primary"
        >
          Save Vehicle
        </button>
      </div>
    </div>
  )
}
