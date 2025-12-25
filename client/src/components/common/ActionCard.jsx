import { Link } from "react-router-dom"

export default function ActionCard({ title, desc, path }) {
  return (
    <Link
      to={path}
      className="bg-[#0f172a] border border-white/10 rounded-xl p-5 hover:border-cyan-400/30 transition"
    >
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </Link>
  )
}
