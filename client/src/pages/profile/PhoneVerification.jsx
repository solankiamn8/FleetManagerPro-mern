import { useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"
import { useAuth } from "../../hooks/useAuth"
import {
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"

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
      const res = await api.post("/users/phone-number", { phone })

      toast.success("OTP sent to your phone")

      // 👇 DEMO OTP handling
      if (res.data?.devOtp) {
        toast(
          (t) => (
            <div className="text-sm">
              <div className="font-semibold mb-1">
                Demo OTP
              </div>
              <div className="font-mono tracking-widest text-lg">
                {res.data.devOtp}
              </div>
              <button
                className="text-xs mt-2 underline"
                onClick={() => {
                  navigator.clipboard.writeText(res.data.devOtp)
                  toast.dismiss(t.id)
                  toast.success("OTP copied")
                }}
              >
                Copy OTP
              </button>
            </div>
          ),
          { duration: 8000 }
        )
      }

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
      await api.post("/users/phone-number/verify", { otp })
      await refreshUser()
      toast.success("Phone verified successfully 🎉")
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="
      bg-white/10 backdrop-blur-md
      border border-white/20
      rounded-2xl p-6
      shadow-xl
      max-w-xl
    ">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-cyan-400/20 text-cyan-300">
          {step === "phone"
            ? <PhoneIcon className="w-6 h-6" />
            : <ShieldCheckIcon className="w-6 h-6" />
          }
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Verify your phone number
          </h3>
          <p className="text-sm text-white/70 mt-1">
            Required for trips, tracking and safety alerts
          </p>
        </div>
      </div>

      {step === "phone" ? (
        <>
          <input
            className="auth-input mb-4"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
          />
          <button
            onClick={sendOTP}
            disabled={loading}
            className="btn-grad w-full"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            className="auth-input mb-4 text-center tracking-widest text-lg"
            placeholder="Enter OTP"
            maxLength={4}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
          />
          <button
            onClick={verifyOTP}
            disabled={loading}
            className="btn-grad w-full"
          >
            Verify Phone
          </button>
        </>
      )}
    </div>
  )
}
