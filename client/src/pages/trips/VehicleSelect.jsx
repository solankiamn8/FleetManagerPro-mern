import { useEffect, useState } from "react"
import api from "../../api/axios"
import clsx from "clsx";
import LicensePlate from "../../components/ui/LicensePlate"


export default function VehicleSelect({ selected, onSelect, onlyEligible }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get("/vehicles").then(res => {
      if (!onlyEligible) {
        setVehicles(res.data);
        return;
      }

      const eligible = res.data.filter(v =>
        v.status === "IDLE" &&
        v.assignedDriver &&
        v.assignedDriver.phone?.verified
      );

      setVehicles(eligible);
    });
  }, [onlyEligible]);

  if (onlyEligible && vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#020617] p-6 text-center">
        <p className="text-sm text-gray-300 font-medium">
          No vehicles available for planning
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Ensure vehicles are:
        </p>
        <ul className="mt-2 text-xs text-gray-400 space-y-1">
          <li>• Status is IDLE</li>
          <li>• Driver is assigned</li>
          <li>• Driver phone is verified</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm text-gray-400 mb-2">Select Vehicle</h4>
      <div className="grid grid-cols-2 gap-3">
        {vehicles.map(v => (
          <button
            disabled={!v.assignedDriver}
            onClick={() => onSelect(v)}
            className={clsx(
              "rounded-xl border p-4 text-left transition",
              "hover:bg-white/5",
              selected?._id === v._id
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-white/10",
              !v.assignedDriver && "opacity-40 cursor-not-allowed"
            )}
          >
            {/* Vehicle header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-white">
                  {v.make} {v.model}
                </div>
                <div className="mt-1">
                  <LicensePlate value={v.licensePlate} />
                </div>
              </div>

              {/* Status badge */}
              <span
                className={clsx(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  v.status === "IDLE"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-gray-500/10 text-gray-400"
                )}
              >
                {v.status}
              </span>
            </div>

            {/* Driver info */}
            <div className="mt-3 text-xs">
              {v.assignedDriver ? (
                <span className="text-green-400">
                  Driver: {v.assignedDriver.name}
                </span>
              ) : (
                <span className="text-red-400">
                  No driver assigned
                </span>
              )}
            </div>
          </button>

        ))}
      </div>
    </div>
  )
}
