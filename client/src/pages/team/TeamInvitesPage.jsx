import { useState } from "react"
import PageHeader from "@/components/common/PageHeader"
import InviteForm from "./InviteForm"
import PendingInvites from "./PendingInvites"

export default function TeamInvitesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invites"
        subtitle="Invite new members and manage pending invitations"
      />

      <InviteForm onSuccess={() => setRefreshKey(k => k + 1)} />

      <PendingInvites refreshKey={refreshKey} />
    </div>
  )
}
