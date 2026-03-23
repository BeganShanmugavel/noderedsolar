const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function headers() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJson(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    if (res.status === 401) {
      const message = (data.error || '').toLowerCase();
      if (message.includes('invalid') || message.includes('expired') || message.includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Session expired. Please login again.');
      }
    }
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseJson(res);
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers() },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function getDashboard(site = 'SOFT-1001') {
  const res = await fetch(`${API_BASE}/dashboard/${site}`, { headers: headers() });
  return parseJson(res);
}

export async function getSiteAlerts(site = 'SOFT-1001') {
  const res = await fetch(`${API_BASE}/alerts/${site}`, { headers: headers() });
  return parseJson(res);
}

export async function getAdminUserDetails() {
  const res = await fetch(`${API_BASE}/admin/user-details`, { headers: headers() });
  return parseJson(res);
}
