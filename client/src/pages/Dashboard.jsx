import { useAuth } from "../hooks/useAuth"
import VerificationBanner from "../components/dashboard/VerificationBanner"
import StatCard from "../components/dashboard/StatCard"
import PageHeader from "../components/common/PageHeader"
import PhoneVerificationCard from "./profile/PhoneVerification"

export default function Dashboard() {
  const { user, role } = useAuth()

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${user?.name || "User"}`}
        subtitle="Fleet overview & operational status"
      />

      {/* Verification */}
      <VerificationBanner />
      <PhoneVerificationCard />

      {/* KPIs */}
      <section className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">📊 Key Metrics</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Vehicles" value="24" tone="info" />
          <StatCard label="Active Trips" value="6" tone="success" />
          <StatCard label="Drivers On Duty" value="8" />
          {role !== "driver" && (
            <StatCard
              label="Maintenance Alerts"
              value="2"
              tone="danger"
            />
          )}
        </div>
      </section>

      {/* Role-based content */}
      <section className="bg-[#111827] border border-white/10 rounded-xl p-6">
        {role === "driver" ? (
          <>
            <h3 className="font-semibold mb-2">🚚 Your Trips</h3>
            <p className="text-gray-400 text-sm">
              Assigned trips and live tracking will appear here.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-semibold mb-2">📈 Operations Overview</h3>
            <p className="text-gray-400 text-sm">
              Analytics, alerts and reports will be shown here.
            </p>
          </>
        )}
      </section>
    </div>
  )
}

