import { NavLink } from "react-router-dom"
import clsx from "clsx"

export default function NavItem({
  label,
  path,
  icon,
  disabled,
}) {
  return (
    <NavLink
      to={disabled ? "#" : path}
      onClick={(e) => disabled && e.preventDefault()}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition",
          isActive && !disabled
            ? "bg-cyan-500/20 text-cyan-300"
            : "text-white/80 hover:bg-white/10",
          disabled && "opacity-40 cursor-not-allowed"
        )
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
      {disabled && (
        <span className="ml-auto text-xs text-red-400">🔒</span>
      )}
    </NavLink>
  )
}
