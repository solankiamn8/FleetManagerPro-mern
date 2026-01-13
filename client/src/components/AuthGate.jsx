import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function AuthGate({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    )
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 📧 Email not verified → block ONLY /app/*
  if (!user.emailVerified && location.pathname.startsWith("/app")) {
    return <Navigate to="/verify-email" replace />
  }

  // ✅ Access granted
  return children
}
