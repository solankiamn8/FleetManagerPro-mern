import React, { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { registerSchema } from '../../schemas/authSchemas'
import Navbar from '../../components/public/Navbar'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('driver')
  const [showPassword, setShowPassword] = useState(false)

  const { register } = useAuth()
  const nav = useNavigate()

  const submit = useCallback(async (e) => {
    e.preventDefault()

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      confirm,
      role,
    })

    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message)
    }

    const loadingId = toast.loading('Creating account...')

    try {
      await register({ name, email, password, role })
      toast.success('Account created! Verify your email.')
      nav('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      toast.dismiss(loadingId)
    }
  }, [name, email, password, confirm, role, register, nav])

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] flex items-center justify-center text-white">
      <Navbar minimal />

      <div className="flex flex-col justify-center pt-32 px-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center mb-5">Create Account</h2>

          {/* Name */}
          <label className="relative block mb-2">
            <span className="text-sm">
              Name<span className="absolute right-0 text-cyan-300">*</span>
            </span>
            <input
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {/* Email */}
          <label className="relative block mb-4">
            <span className="text-sm">
              Email<span className="absolute right-0 text-cyan-300">*</span>
            </span>
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Role */}
          <div className="mb-5 flex items-center gap-4">
            <span className="text-sm whitespace-nowrap">
              Select Role<span className="text-cyan-300 ml-1">*</span>
            </span>

            <div className="flex gap-3">
              {['Driver', 'Manager'].map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r.toLowerCase())}
                  className={`px-4 py-2 rounded-lg border text-sm transition
                    ${role === r.toLowerCase()
                      ? 'bg-cyan-300/20 border-cyan-300'
                      : 'border-white/20 hover:border-white/40'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <label className="relative block mb-4">
            <span className="text-sm">
              Password<span className="absolute right-0 text-cyan-300">*</span>
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

          {/* Confirm Password */}
          <label className="block mb-6">
            <span className="text-sm">Confirm Password *</span>
            <input
              type="password"
              className="auth-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          <button className="btn-grad w-full py-3">Create Account</button>

          <p className="mt-4 text-sm text-center text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-300 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
