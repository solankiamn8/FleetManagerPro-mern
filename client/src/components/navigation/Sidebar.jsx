import { NAV_ITEMS } from "./navConfig"
import NavItem from "./NavItem"
import { useAuth } from "../../hooks/useAuth"

export default function Sidebar() {
  const { role, phoneVerified } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] border-r border-white/10 px-4 py-6">
      <h2 className="text-xl font-bold mb-8 text-white">
        FleetManager<span className="text-cyan-300">PRO</span>
      </h2>

      <nav className="space-y-1">
        {NAV_ITEMS.filter(item =>
          item.roles.includes(role)
        ).map(item => {
          const disabled =
            item.requiresPhone && !phoneVerified

          return (
            <NavItem
              key={item.path}
              {...item}
              disabled={disabled}
            />
          )
        })}
      </nav>
    </aside>
  )
}
