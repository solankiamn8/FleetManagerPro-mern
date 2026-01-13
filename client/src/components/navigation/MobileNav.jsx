import { NAV_ITEMS } from "./navConfig"
import NavItem from "./NavItem"
import { useAuth } from "../../hooks/useAuth"
import { XMarkIcon } from "@heroicons/react/24/outline"

export default function MobileNav({ open, onClose }) {
  const { role, phoneVerified } = useAuth()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="
          absolute top-0 left-0 w-full
          bg-[#0f172a]
          border-b border-white/10
          shadow-2xl
          p-5
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            FleetManager<span className="text-cyan-300">PRO</span>
          </h2>

          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-white/80" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="space-y-2">
          {NAV_ITEMS.filter(item =>
            item.roles.includes(role)
          ).map(item => {
            const disabled =
              item.requiresPhone && !phoneVerified

            return (
              <div key={item.path} onClick={onClose}>
                <NavItem {...item} disabled={disabled} />
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
