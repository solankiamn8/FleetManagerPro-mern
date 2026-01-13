import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "@/api/axios"

export default function PendingInvites({ refreshKey }) {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInvites = async () => {
    try {
      const res = await api.get("/invites")
      setInvites(res.data)
    } catch {
      toast.error("Failed to load invites")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
    const t = setInterval(fetchInvites, 15000)
    return () => clearInterval(t)
  }, [refreshKey])

  const getExpiryLabel = (date) => {
    const diff = new Date(date) - new Date();
    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Less than 1h";
    return `${hours}h left`;
  };

  const revoke = async (id) => {
    try {
      await api.delete(`/invites/${id}`);
      toast.success("Invite revoked");
      fetchInvites();
    } catch {
      toast.error("Failed to revoke invite");
    }
  };

  const resend = async (id) => {
    try {
      await api.post(`/invites/${id}/resend`)
      toast.success("Invite resent")
      fetchInvites()
    } catch {
      toast.error("Failed to resend invite")
    }
  }


  if (loading) return <p className="text-gray-400">Loading invites...</p>

  if (!invites.length) {
    return (
      <p className="text-gray-400 text-sm">
        No pending invites
      </p>
    )
  }

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-md overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="font-semibold">Pending Invites</h3>
        <p className="text-sm text-gray-400">
          Invitations awaiting acceptance
        </p>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-[#020617] text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Expires In</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invites.map(inv => (
            <tr key={inv._id} className="border-t border-white/5">
              <td className="px-4 py-3">{inv.email}</td>
              <td className="px-4 py-3 capitalize">{inv.role}</td>
              <td className="px-4 py-3 text-yellow-400">Pending</td>
              <td className="px-4 py-3 text-yellow-400">
                {getExpiryLabel(inv.expiresAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-4">

                  <button
                    onClick={() => resend(inv._id)}
                    className="text-cyan-400 hover:underline text-sm"
                  >
                    Resend
                  </button>

                  <button
                    onClick={() => revoke(inv._id)}
                    className="text-red-400 hover:underline text-sm"
                  >
                    Revoke
                  </button>
                </div>
              </td>


            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
