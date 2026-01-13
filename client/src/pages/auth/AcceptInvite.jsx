import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import api from "@/api/axios"
import Navbar from "@/components/public/Navbar"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

export default function AcceptInvite() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get("token")

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Invalid or expired invite
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!name || password.length < 8) {
      return toast.error("Enter name and a strong password")
    }

    try {
      setLoading(true)
      await api.post("/invites/accept", { token, name, password })
      toast.success("Account created! Please login.")
      navigate("/login", { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || "Invite failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] text-white">
      <Navbar minimal />

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-24">
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT TEXT */}
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold mb-4">
              You’ve been invited 🎉
            </h1>
            <p className="text-white/80 max-w-md">
              Complete your account to join the organization.
              You’ll be able to access fleet tools after verification.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={submit}
            className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md
                       border border-white/20 rounded-2xl p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Accept Invitation
            </h2>

            <input
              className="auth-input mb-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input pr-10"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              disabled={loading}
              className="btn-grad w-full py-3"
            >
              Create Account
            </button>

            <p className="mt-4 text-sm text-center text-white/70">
              Already have access?{" "}
              <Link to="/login" className="text-cyan-300 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
