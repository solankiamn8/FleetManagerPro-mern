import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '../../components/public/Navbar'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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


      toast.success("Welcome back!")
      navigate("/app", { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials")
    }
  }




  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] flex items-center justify-center text-white">
      <Navbar minimal />

      <div className="flex flex-col justify-center pt-32 px-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

          {/* Email */}
          <label className="relative block mb-4">
            <span className="text-sm">
              Email
              <span className="absolute right-0 text-cyan-300">*</span>
            </span>
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Password */}
          <label className="relative block mb-6">
            <span className="text-sm">
              Password
              <span className="absolute right-0 text-cyan-300">*</span>
            </span>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                👁️
              </button>
            </div>
          </label>

          <button className="btn-grad w-full py-3">Sign In</button>

          <p className="mt-4 text-sm text-center text-white/70">
            Don’t have an account?{' '}
            <Link to="/register" className="text-cyan-300 hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
