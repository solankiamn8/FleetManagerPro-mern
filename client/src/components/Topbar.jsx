import { useAuth } from "../hooks/useAuth"

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#020617] border-b border-white/10">
      <h3 className="text-lg font-semibold text-white">
        FleetManager<span className="text-cyan-400">PRO</span>
      </h3>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            {user.name}
            <span className="ml-1 text-gray-500">
              ({user.role})
            </span>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-500/90 hover:bg-red-500 text-white text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
