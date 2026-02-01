import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { saveAuth, getToken, clearAuth } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session on refresh
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔑 Login
  // Inside AuthContext.js

  const login = async (email, password) => {
    console.log("1. Attempting Login...");
    const res = await api.post("/auth/login", { email, password });

    console.log("2. Axios Raw Response:", res);

    // FIX: Handle both Axios response structure AND direct data
    const data = res.data ? res.data : res;

    console.log("3. Extracted Data:", data);

    // CHECK: specific property check
    if (data.otpRequired) {
      console.log("4. OTP Flow Triggered");
      return {
        otpRequired: true,
        userId: data.userId,
        email,
        password,
        devOtp: data.devOtp,
      };
    }

    console.log("4. Regular Login Flow Triggered");
    saveAuth(data);
    setUser(data.user);
    return { otpRequired: false };
  };

  // 🆕 Register
  const register = async (data) => {
    const res = await api.post("/auth/register", data);

    const data = res.data || res;

    saveAuth(data);
    setUser(data.user);

    // 🔑 STORE OTP USER ID
    sessionStorage.setItem("otpUserId", data.userId);

    return data;
  };

  // 🚪 Logout
  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const hydrateUser = (user) => {
    setUser(user);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      clearAuth();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
