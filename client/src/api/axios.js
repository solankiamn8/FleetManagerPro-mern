import axios from "axios"
import { getToken, clearAuth } from "../utils/storage"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
})

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 🚨 Global response handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    // 🔒 Account suspended
    if (status === 403 && message === "Account suspended") {
      // IMPORTANT: do NOT logout
      // just let UI refresh user state
      return Promise.reject(error)
    }

    // 🔑 Invalid / expired token
    if (status === 401) {
      clearAuth()
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api
