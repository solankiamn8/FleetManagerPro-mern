import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../api/axios"
import PageHeader from "../../components/common/PageHeader"

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/users/drivers/stats")
      .then(res => setDrivers(res.data))
      .finally(() => setLoading(false))
  }, [])


  if (loading) {
    return <p className="text-gray-400">Loading drivers...</p>
  }

  if (!drivers.length) {
    return <p className="text-gray-400">No drivers found</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        subtitle="Manage and monitor your drivers"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map(driver => (
          <Link
            key={driver._id}
            to={`/app/drivers/${driver._id}`}
            className="bg-[#0f172a] border border-white/10 rounded-xl p-5 hover:border-cyan-400 transition"
          >
            <h3 className="font-semibold">{driver.name}</h3>

            <p className="text-sm text-gray-400">{driver.email}</p>

            <p className="text-sm text-gray-400">
              Trips completed: {driver.tripsCount}
            </p>

            <p className="text-sm mt-1">
              📱 {driver.phone?.number || "Not added"}{" "}
              {driver.phone?.verified ? "✅" : "❌"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
