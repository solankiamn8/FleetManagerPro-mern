import { useEffect, useState } from "react"
import api from "../../api/axios"

export default function DriverSelect({ selected, onSelect }) {
  const [drivers, setDrivers] = useState([])

  useEffect(() => {
    api.get("/users/drivers").then(res => setDrivers(res.data))
  }, [])

  return (
    <div>
      <h4 className="text-sm text-gray-400 mb-2">Select Driver</h4>
      <div className="space-y-2">
        {drivers.map(d => (
          <button
            key={d._id}
            onClick={() => onSelect(d)}
            className={`w-full text-left p-3 rounded border ${
              selected?._id === d._id
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-white/10"
            }`}
          >
            <div className="font-medium">{d.name}</div>
            <div className="text-xs text-gray-400">
              {d.phone?.number || "No phone"}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
