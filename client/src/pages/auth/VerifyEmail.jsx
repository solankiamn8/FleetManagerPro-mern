import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../../api/axios"
import { saveAuth } from "../../utils/storage"
import { useAuth } from "../../hooks/useAuth"

export default function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  const { hydrateUser } = useAuth() // 🔑 we’ll reuse auth flow

  const userId = sessionStorage.getItem("otpUserId")

  // No OTP session → go back
  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true })
    }
  }, [userId, navigate])

  const verifyOTP = async (e) => {
    e.preventDefault()

    if (otp.length !== 6) {
      return toast.error("Enter 6-digit OTP")
    }

    const loading = toast.loading("Verifying OTP...")

    try {
      const res = await api.post("/auth/verify-otp", {
        userId,
        otp,
      })

      // ✅ THIS IS THE KEY PART
      saveAuth(res.data)
      hydrateUser(res.data.user)

      sessionStorage.removeItem("otpUserId")

      toast.success("Email verified & logged in 🎉")
      navigate("/app", { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP")
    } finally {
      toast.dismiss(loading)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] text-white">
      <form
        onSubmit={verifyOTP}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Verify your email
        </h2>

        <input
          className="auth-input text-center tracking-widest text-lg"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <button className="btn-grad w-full mt-6">
          Verify
        </button>
      </form>
    </div>
  )
}
