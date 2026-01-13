import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../hooks/useAuth"
import Navbar from "../../components/public/Navbar"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    try {
      const result = await login(email, password)

      if (result?.otpRequired) {
        sessionStorage.setItem("otpUserId", result.userId)
        navigate("/verify-email", { replace: true })
        return
      }

      toast.success("Welcome back 👋")
      navigate("/app", { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] text-white">
      <Navbar minimal />

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-24">
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT: TEXT (mirrors Register) */}
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold mb-4">
              Welcome back
            </h1>
            <p className="text-white/80 max-w-md">
              Sign in to manage your fleet, track trips, and collaborate
              with your team in real time.
            </p>
          </div>

          {/* RIGHT: FORM */}
          <form
            onSubmit={submit}
            className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md
                       border border-white/20 rounded-2xl p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Sign in
            </h2>

            <input
              className="auth-input mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-white/60 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <button className="btn-grad w-full py-3">
              Sign In
            </button>

            <p className="mt-4 text-sm text-center text-white/70">
              Don’t have an account?{" "}
              <Link to="/register" className="text-cyan-300 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
