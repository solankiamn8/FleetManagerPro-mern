import { useEffect, useState } from "react"
import api from "@/api/axios"
import toast from "react-hot-toast"
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid"
import { useAuth } from "@/hooks/useAuth"

export default function TeamMembers({ refreshKey }) {
  const { user, refreshUser } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    try {
      const res = await api.get("/users/team")
      setMembers(res.data)
    } catch {
      toast.error("Failed to load team members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [refreshKey])

  const suspend = async (id) => {
    await api.patch(`/users/${id}/suspend`)
    toast.success("User suspended")

    if (id === user.id) {
      await refreshUser() // 🔥 THIS is the key
    }

    fetchMembers()
  }


  const activate = async (id) => {
    await api.patch(`/users/${id}/activate`)
    toast.success("User activated")

    if (id === user.id) {
      await refreshUser()
    }

    fetchMembers()
  }


  const remove = async (id) => {
    if (!confirm("Remove this user from the organization?")) return
    await api.delete(`/users/${id}`)
    toast.success("User removed")
    fetchMembers()
  }

  if (loading) return <p className="text-gray-400">Loading team…</p>

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-md">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="font-semibold">Team Members</h3>
        <p className="text-sm text-gray-400">List of team members</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-[#020617] text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map(u => {
              const isSelf = u._id === user.id
              const isOwner = u.isOwner // see note below

              return (
                <tr
                  key={u._id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    {u.name}
                    {u.emailVerified ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-yellow-400" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs
                        ${u.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {!isSelf && !isOwner && (
                      <div className="inline-flex gap-4">
                        {u.status === "active" ? (
                          <button
                            onClick={() => suspend(u._id)}
                            className="text-yellow-400 hover:underline"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => activate(u._id)}
                            className="text-green-400 hover:underline"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() => remove(u._id)}
                          className="text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
