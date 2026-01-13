import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../../api/axios"
import { saveAuth } from "../../utils/storage"
import { useAuth } from "../../hooks/useAuth"
import Navbar from "../../components/public/Navbar"

export default function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const navigate = useNavigate()
  const { hydrateUser, user } = useAuth()

  const userId = sessionStorage.getItem("otpUserId")

  useEffect(() => {
    if (!userId) navigate("/login", { replace: true })
  }, [userId, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const maskEmail = (email) => {
    if (!email) return ""
    const [n, d] = email.split("@")
    return n.slice(0, 2) + "****" + n.slice(-1) + "@" + d
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP")

    const loading = toast.loading("Verifying...")

    try {
      const res = await api.post("/auth/email-verify", { userId, otp })

      saveAuth(res.data)
      hydrateUser(res.data.user)

      sessionStorage.removeItem("otpUserId")

      toast.success("Email verified 🎉")
      navigate("/app", { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP")
    } finally {
      toast.dismiss(loading)
    }
  }

  const resendOTP = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);

      await api.post("/auth/email/resend", {
        userId,
      });

      toast.success("OTP resent successfully");
      setCooldown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] text-white">
      <Navbar minimal />

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-24">
        <form
          onSubmit={verifyOTP}
          className="w-full max-w-md bg-white/10 backdrop-blur-md
                     border border-white/20 rounded-2xl p-8 shadow-2xl text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Verify your email</h2>

          <p className="text-white/70 text-sm mb-6">
            We sent a 6-digit code to <br />
            <span className="font-medium text-white">
              {maskEmail(user?.email)}
            </span>
          </p>

          <input
            className="auth-input text-center tracking-widest text-xl mb-4"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <button className="btn-grad w-full py-3 mb-4">
            Verify Email
          </button>

          <button
            type="button"
            onClick={resendOTP}
            disabled={cooldown > 0 || resending}
            className="text-sm text-cyan-300 hover:underline disabled:opacity-50"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
          </button>
        </form>
      </div>
    </div>
  )
}
