import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function safeParseUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch (err) {
    console.warn('Invalid user data in localStorage, resetting session.');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeParseUser(localStorage.getItem('user')));

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
