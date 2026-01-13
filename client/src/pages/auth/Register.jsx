import { useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../hooks/useAuth"
import { registerSchema } from "../../schemas/authSchemas"
import Navbar from "../../components/public/Navbar"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";


export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = useCallback(async (e) => {
    e.preventDefault()

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      confirm,
    })

    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message)
    }

    const loadingId = toast.loading("Creating organization...")

    try {
      await register({ name, email, password })
      toast.success("Account created! Please login.")
      navigate("/verify-email")
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed")
    } finally {
      toast.dismiss(loadingId)
    }
  }, [name, email, password, confirm, register, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] text-white">
      <Navbar minimal />

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-24">
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT: TEXT */}
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold mb-4">
              Create your fleet workspace
            </h1>
            <p className="text-white/80 max-w-md">
              You’ll start as the organization owner.
              Invite managers and drivers once you’re inside.
            </p>
          </div>

          {/* RIGHT: FORM */}
          <form
            onSubmit={submit}
            className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md
                       border border-white/20 rounded-2xl p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create Account
            </h2>

            <input
              className="auth-input mb-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="auth-input mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative mb-3">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>

            </div>

            <input
              type="password"
              className="auth-input mb-6"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button className="btn-grad w-full py-3">
              Create Organization
            </button>

            <p className="mt-4 text-sm text-center text-white/70">
              Already have an account?{" "}
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
