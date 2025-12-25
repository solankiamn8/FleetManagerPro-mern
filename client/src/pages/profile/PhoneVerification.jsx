import { useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"
import { useAuth } from "../../hooks/useAuth"

export default function PhoneVerification() {
  const { phoneVerified, refreshUser } = useAuth()
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState("phone")
  const [loading, setLoading] = useState(false)

  if (phoneVerified) return null

  const sendOTP = async () => {
    if (phone.length < 10) {
      return toast.error("Enter a valid phone number")
    }

    try {
      setLoading(true)
      await api.post("/users/phone", { phone })
      toast.success("OTP sent to phone")
      setStep("otp")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      return toast.error("Enter 4-digit OTP")
    }

    try {
      setLoading(true)
      await api.post("/users/phone/verify", { otp })

      // ✅ refresh user from /auth/me
      await refreshUser()

      toast.success("Phone verified successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-5">
      <h3 className="font-semibold mb-2">📱 Verify your phone number</h3>

      {step === "phone" ? (
        <>
          <input
            className="auth-input mb-3"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
          <button onClick={sendOTP} disabled={loading} className="btn-grad w-full">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            className="auth-input mb-3 text-center tracking-widest"
            placeholder="Enter OTP"
            maxLength={4}   // ✅ FIXED
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button onClick={verifyOTP} disabled={loading} className="btn-grad w-full">
            Verify Phone
          </button>
        </>
      )}
    </div>
  )
}
