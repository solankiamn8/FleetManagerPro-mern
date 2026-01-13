import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../api/axios"
import PageHeader from "../../components/common/PageHeader"

export default function DriverDetails() {
  const { id } = useParams()
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/users/drivers/${id}`)
      .then(res => setDriver(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-400">Loading driver...</p>
  if (!driver) return <p className="text-gray-400">Driver not found</p>

  return (
    <div className="space-y-6">
      <PageHeader
        title={driver.name}
        subtitle="Driver profile"
      />

      <section className="bg-[#0f172a] border border-white/10 rounded-xl p-6 space-y-2">
        <p><b>Email:</b> {driver.email}</p>

        <p>
          <b>Phone:</b>{" "}
          {driver.phone?.number || "Not provided"}{" "}
          {driver.phone?.verified ? "✅" : "❌"}
        </p>

        <p><b>Role:</b> {driver.role}</p>
      </section>
    </div>
  )
}
