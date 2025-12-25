import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export default function VerificationBanner() {
  const { emailVerified, phoneVerified } = useAuth()

  if (emailVerified && phoneVerified) return null

  return (
    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 text-sm">
      {!emailVerified && (
        <div className="mb-2">
          ⚠️ Your email is not verified.
          <span className="ml-2 text-yellow-300">
            Please verify to access all features.
          </span>
        </div>
      )}

      {emailVerified && !phoneVerified && (
        <div>
          📱 Phone verification required for restricted actions.
          <Link
            to="/app/verify-phone"
            className="ml-2 text-cyan-300 underline"
          >
            Verify now
          </Link>
        </div>
      )}
    </div>
  )
}
