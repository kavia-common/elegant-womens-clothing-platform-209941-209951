/* AuthContext manages admin auth state with JWT token saved to localStorage */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);
const TOKEN_KEY = 'auth_token';

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides admin auth: token, isAuthenticated, login(email,pw), logout() */
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try { setToken(localStorage.getItem(TOKEN_KEY)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch { /* ignore */ }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data && data.token) setToken(data.token);
    if (data && data.user) setProfile(data.user);
    return data;
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* backend may not implement yet */ }
    setToken(null);
    setProfile(null);
  };

  const value = useMemo(() => ({
    token,
    profile,
    isAuthenticated: !!token,
    login,
    logout
  }), [token, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context safely */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
