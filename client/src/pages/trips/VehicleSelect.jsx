import { useEffect, useState } from "react"
import api from "../../api/axios"

export default function VehicleSelect({ selected, onSelect }) {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    api.get("/vehicles").then(res => setVehicles(res.data))
  }, [])

  return (
    <div>
      <h4 className="text-sm text-gray-400 mb-2">Select Vehicle</h4>
      <div className="grid grid-cols-2 gap-3">
        {vehicles.map(v => (
          <button
            key={v._id}
            onClick={() => onSelect(v)}
            className={`p-3 rounded border ${
              selected?._id === v._id
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-white/10"
            }`}
          >
            <div className="font-medium">
              {v.make} {v.model}
            </div>
            <div className="text-xs text-gray-400">
              {v.licensePlate}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
