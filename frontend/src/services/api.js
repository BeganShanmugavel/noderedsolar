const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getDashboard(site = 'SOFT-1001') {
  const res = await fetch(`${API_BASE}/dashboard/${site}`);
  if (!res.ok) throw new Error('Unable to fetch dashboard');
  return res.json();
}
