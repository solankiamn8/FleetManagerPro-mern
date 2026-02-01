import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/public/Navbar";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { showDemoToast } from "../../components/account/ShowDemoToast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result?.otpRequired) {
        sessionStorage.setItem("otpUserId", result.userId);

        if (result.devOtp) {
          showDemoToast(result.devOtp);
        }

        navigate("/verify-email", { replace: true });
        return;
      }

      toast.success("Welcome back 👋");
      navigate("/app", { replace: true });
    } catch (err) {
      // improved error message handling
      const errorMessage =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Network Error - Backend Unreachable"
          : "Invalid credentials");

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff] text-white">
      <Navbar minimal />

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-24">
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT: TEXT (mirrors Register) */}
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold mb-4">Welcome back</h1>
            <p className="text-white/80 max-w-md">
              Sign in to manage your fleet, track trips, and collaborate with
              your team in real time.
            </p>
          </div>

          {/* RIGHT: FORM */}
          <form
            onSubmit={submit}
            className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md
                       border border-white/20 rounded-2xl p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>

            <input
              className="auth-input mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
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

            <button
              className="btn-grad w-full py-3 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* Simple Spinner */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
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
  );
}
