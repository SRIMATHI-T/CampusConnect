import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cc_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(getToken()));
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api('/auth/me').then(data => { setUser(data.user); localStorage.setItem('cc_user', JSON.stringify(data.user)); })
      .catch(() => { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);
  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('cc_token', data.token); localStorage.setItem('cc_user', JSON.stringify(data.user)); setUser(data.user); return data.user;
  }
  async function register(name, email, password) {
    const data = await api('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    localStorage.setItem('cc_token', data.token); localStorage.setItem('cc_user', JSON.stringify(data.user)); setUser(data.user); return data.user;
  }
  function logout() { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); setUser(null); }
  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user), role: user?.role }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
