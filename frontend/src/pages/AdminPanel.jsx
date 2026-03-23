import { useState } from 'react';
import { registerUser } from '../services/api';

export default function AdminPanel() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    site_identifier: '',
    location: '',
    weather_location: '',
    capacity_kw: '',
    panel_count: '',
    panel_type: '',
  });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await registerUser(form);
      setStatus('User and plant registered successfully by admin.');
      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        site_identifier: '',
        location: '',
        weather_location: '',
        capacity_kw: '',
        panel_count: '',
        panel_type: '',
      });
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="glass card">
      <h2>Admin User Registration</h2>
      <p>Create user accounts with essential profile + plant details required for analysis.</p>
      <form className="form-grid" onSubmit={submit}>
        <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Plant Site ID" value={form.site_identifier} onChange={(e) => setForm({ ...form, site_identifier: e.target.value })} required />
        <input placeholder="Plant Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input placeholder="Weather Location (City)" value={form.weather_location} onChange={(e) => setForm({ ...form, weather_location: e.target.value })} required />
        <input placeholder="Capacity (kW)" type="number" step="0.1" min="0.1" value={form.capacity_kw} onChange={(e) => setForm({ ...form, capacity_kw: e.target.value })} required />
        <input placeholder="Panel Count" type="number" min="1" value={form.panel_count} onChange={(e) => setForm({ ...form, panel_count: e.target.value })} required />
        <input placeholder="Panel Type (Mono/PERC/etc.)" value={form.panel_type} onChange={(e) => setForm({ ...form, panel_type: e.target.value })} required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn-primary" type="submit">Create Account</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
