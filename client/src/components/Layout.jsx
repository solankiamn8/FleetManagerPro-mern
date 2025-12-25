import Sidebar from "@/components/navigation/Sidebar"
import Topbar from "@/components/Topbar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[#0b1220] text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

