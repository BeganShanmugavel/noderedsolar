import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expMs = (payload.exp || 0) * 1000;
    return Date.now() >= expMs;
  } catch {
    return true;
  }
}

function safeParseUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return safeParseUser(localStorage.getItem('user'));
  });

  const value = useMemo(() => ({
    user,
    loginSession: (token, profile) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(profile));
      setUser(profile);
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
