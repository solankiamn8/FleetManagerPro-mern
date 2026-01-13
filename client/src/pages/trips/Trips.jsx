import { useState } from "react"
import PageHeader from "../../components/common/PageHeader"
import TripTable from "./TripTable"

export default function Trips() {
  const [onlyActive, setOnlyActive] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trips"
        subtitle="View and track all trips"
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={e => setOnlyActive(e.target.checked)}
          />
          Show active trips only
        </label>
      </div>

      <TripTable onlyActive={onlyActive} />
    </div>
  )
}
