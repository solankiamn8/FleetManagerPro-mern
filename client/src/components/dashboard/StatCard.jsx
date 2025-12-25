export default function StatCard({ label, value, icon, tone = "info" }) {
  const tones = {
    info: "border-cyan-400/30 text-cyan-300",
    success: "border-green-400/30 text-green-300",
    danger: "border-red-400/30 text-red-300",
    warning: "border-yellow-400/30 text-yellow-300",
  }

  return (
    <div className={`bg-[#0f172a] border ${tones[tone]} rounded-xl p-5`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mt-2 text-white">
        {value}
      </div>
    </div>
  )
}
