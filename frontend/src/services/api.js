const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function headers() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Register failed');
  return data;
}

export async function getDashboard(site = 'SOFT-1001') {
  const res = await fetch(`${API_BASE}/dashboard/${site}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unable to fetch dashboard');
  return data;
}

export async function getSiteAlerts(site = 'SOFT-1001') {
  const res = await fetch(`${API_BASE}/alerts/${site}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unable to fetch alerts');
  return data;
}
