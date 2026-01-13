import PageHeader from "@/components/common/PageHeader"
import ActivityLog from "./ActivityLog"

export default function TeamActivityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Team Activity"
        subtitle="Audit log of team-related actions"
      />

      <ActivityLog />
    </div>
  )
}
