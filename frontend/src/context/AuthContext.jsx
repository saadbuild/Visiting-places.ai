import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("vp_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.me(token);
        if (!cancelled) setUser(user);
      } catch {
        if (!cancelled) {
          setToken(null);
          localStorage.removeItem("vp_token");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUser();
    return () => { cancelled = true; };
  }, [token]);

  const register = useCallback(async (payload) => {
    setError(null);
    const data = await api.register(payload);
    localStorage.setItem("vp_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (payload) => {
    setError(null);
    const data = await api.login(payload);
    localStorage.setItem("vp_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("vp_token");
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await api.updateMe(payload, token);
    setUser(data.user);
    return data.user;
  }, [token]);

  const value = useMemo(
    () => ({ token, user, loading, error, setError, register, login, logout, updateProfile, isAuthenticated: !!user }),
    [token, user, loading, error, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
