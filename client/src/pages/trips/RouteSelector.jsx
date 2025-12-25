export default function RouteSelector({ routes, selected, onSelect }) {
  return (
    <div className="space-y-2">
      {routes.map((route, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-full text-left px-4 py-3 rounded-lg border transition ${
            selected === idx
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-white/10 hover:bg-white/5"
          }`}
        >
          <div className="font-medium">{route.name}</div>
          <div className="text-xs text-gray-400">
            {route.distanceKm} km • {route.estimatedTimeMin} min
          </div>
        </button>
      ))}
    </div>
  )
}
