import { useState } from "react"
import PageHeader from "@/components/common/PageHeader"
import TeamMembers from "./TeamMembers"

export default function TeamMembersPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team Members"
        subtitle="Manage active users in your organization"
      />

      <TeamMembers refreshKey={refreshKey} />
    </div>
  )
}
