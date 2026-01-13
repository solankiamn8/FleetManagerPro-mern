import { useEffect, useState } from "react"
import api from "@/api/axios"
import toast from "react-hot-toast"

const LABELS = {
  invite_sent: "sent an invite",
  invite_accepted: "joined the organization",
  invite_resent: "resent an invite",
  invite_revoked: "revoked an invite",
  user_suspended: "suspended a user",
  user_activated: "reactivated a user",
  user_removed: "removed a user",
}

const COLORS = {
  invite_sent: "text-cyan-400",
  invite_accepted: "text-green-400",
  invite_resent: "text-blue-400",
  invite_revoked: "text-red-400",
  user_suspended: "text-yellow-400",
  user_activated: "text-green-400",
  user_removed: "text-red-500",
}

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get("/activity", {
        params: { type, page, limit: 8 },
      })

      setLogs(res.data.logs)
      setTotalPages(res.data.totalPages)
    } catch {
      toast.error("Failed to load activity")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [type, page])

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold">Team Activity</h3>
          <p className="text-sm text-gray-400">
            Invites & member actions
          </p>
        </div>

        {/* Filter */}
        <div className="relative">
  <select
    value={type}
    onChange={(e) => {
      setPage(1)
      setType(e.target.value)
    }}
    className="auth-select"
  >
    <option value="all">All activity</option>
    <option value="invite_sent">Invites sent</option>
    <option value="invite_accepted">Invites accepted</option>
    <option value="invite_resent">Invites resent</option>
    <option value="invite_revoked">Invites revoked</option>
    <option value="user_suspended">Users suspended</option>
    <option value="user_activated">Users activated</option>
    <option value="user_removed">Users removed</option>
  </select>

  {/* Chevron */}
  <svg
    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
</div>

      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Actor</th>
              <th className="px-6 py-3 text-left font-medium">Action</th>
              <th className="px-6 py-3 text-left font-medium">Target</th>
              <th className="px-6 py-3 text-right font-medium">Time</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-gray-400">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-gray-400">
                  No activity found
                </td>
              </tr>
            )}

            {logs.map(log => (
              <tr
                key={log._id}
                className="hover:bg-white/5 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {log.actor?.name || "System"}
                </td>

                <td className={`px-6 py-4 ${COLORS[log.type] || "text-gray-300"}`}>
                  {LABELS[log.type] || log.type}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {log.targetEmail || "—"}
                </td>

                <td className="px-6 py-4 text-right text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-white/10">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(p => p - 1)}
          className="ui-btn-primary disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage(p => p + 1)}
          className="ui-btn-primary disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
