import { Link } from "react-router-dom"
import { useState, memo } from "react"

function Navbar({ minimal = false }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-4 mt-4 rounded-2xl backdrop-blur-sm bg-white/15 border border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          <Link to="/" className="text-xl font-bold text-white">
            FleetManager<span className="text-cyan-300">PRO</span>
          </Link>

          {!minimal && (
            <>
              <nav className="hidden md:flex gap-8 text-white/90">
                {["features", "about", "contact"].map((item) => (
                  <a key={item} href={`#${item}`} className="hover:text-white">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                ))}
              </nav>

              <div className="hidden md:flex gap-3">
                <Link to="/login" className="btn-grad text-sm">Login</Link>
                <Link to="/register" className="btn-grad text-sm">Sign Up</Link>
              </div>

              <button
                aria-label="Menu"
                className="md:hidden"
                onClick={() => setOpen((v) => !v)}
              >
                ☰
              </button>
            </>
          )}
        </div>

        {!minimal && open && (
          <div className="md:hidden px-6 pb-4 space-y-4 text-white/90">
            {["features", "about", "contact"].map((item) => (
              <a key={item} href={`#${item}`} className="block">
                {item}
              </a>
            ))}
            <Link to="/login" className="btn-grad block">Login</Link>
            <Link to="/register" className="btn-grad block">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default memo(Navbar)
