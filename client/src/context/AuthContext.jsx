import React, { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"
import { saveAuth, getToken, clearAuth } from "../utils/storage"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔄 Restore session on refresh
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => {
        clearAuth()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  // 🔑 Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })

    if (res.data.otpRequired) {
      return {
        otpRequired: true,
        userId: res.data.userId,
        email,
        password,
      }
    }

    saveAuth(res.data)
    setUser(res.data.user)
    return { otpRequired: false }
  }

  // 🆕 Register
  const register = async (data) => {
    await api.post("/auth/register", data)
  }

  // 🚪 Logout
  const logout = () => {
    clearAuth()
    setUser(null)
  }

  const hydrateUser = (user) => {
    setUser(user)
  }

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me")
      setUser(res.data.user)
    } catch {
      clearAuth()
      setUser(null)
    }
  }



  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      hydrateUser, // ✅ ADD THIS
      refreshUser,
      isAuthenticated: !!user,
      emailVerified: user?.emailVerified,
      phoneVerified: user?.phoneVerified,
      role: user?.role,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
