import { useState } from "react"
import Sidebar from "@/components/navigation/Sidebar"
import Topbar from "@/components/Topbar"
import MobileNav from "@/components/navigation/MobileNav"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#0b1220] text-gray-200">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile menu */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
