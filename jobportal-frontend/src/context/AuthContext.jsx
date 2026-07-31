import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser } from "../api/auth";
import { getMyProfile } from "../api/user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getMyProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadProfile().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function login(email, password) {
    const jwt = await loginUser({ email, password });
    localStorage.setItem("token", jwt);
    setToken(jwt);
    await loadProfile();
    return jwt;
  }

  function loginWithToken(jwt) {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  }

  async function register(payload) {
    return registerUser(payload);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    isRecruiter: user?.role === "RECRUITER",
    isJobSeeker: user?.role === "JOB_SEEKER",
    login,
    loginWithToken,
    register,
    logout,
    refreshProfile: loadProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
