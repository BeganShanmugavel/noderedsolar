const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    return parseJson(res);
  } catch (err) {
    if (err?.message === 'Failed to fetch') {
      throw new Error('Backend API not reachable. Start backend server and verify VITE_API_URL/proxy.');
    }
    throw err;
  }
}

export async function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers() },
    body: JSON.stringify(payload),
  });
}

export async function getDashboard(site = 'SOFT-1001') {
  return apiFetch(`/dashboard/${site}`, { headers: headers() });
}

export async function getSiteAlerts(site = 'SOFT-1001') {
  return apiFetch(`/alerts/${site}`, { headers: headers() });
}

export async function getAdminUserDetails() {
  return apiFetch('/admin/user-details', { headers: headers() });
}

export async function uploadSensorCsv(siteIdentifier, file) {
  const form = new FormData();
  form.append('site_identifier', siteIdentifier || '');
  form.append('file', file);
  return apiFetch('/sensors/upload-csv', {
    method: 'POST',
    headers: { ...headers() },
    body: form,
  });
}

export async function deleteUserById(userId) {
  return apiFetch(`/admin/user/${userId}`, {
    method: 'DELETE',
    headers: { ...headers() },
  });
}
