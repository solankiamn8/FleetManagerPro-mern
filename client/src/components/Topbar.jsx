import { Bars3Icon } from "@heroicons/react/24/outline"
import { useAuth } from "../hooks/useAuth"

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3
                       bg-[#020617] border-b border-white/10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-white/80"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <h3 className="text-lg font-semibold">
          FleetManager<span className="text-cyan-400">PRO</span>
        </h3>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-gray-300">
            {user.name} ({user.role})
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-500/90 hover:bg-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
