import { useState } from 'react';
import { registerUser } from '../services/api';

export default function AdminPanel() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await registerUser(form);
      setStatus('User registered successfully by admin.');
      setForm({ name: '', email: '', password: '', role: 'user' });
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="glass card">
      <h2>Admin User Registration</h2>
      <p>Only admins can create user accounts. End users can only login.</p>
      <form className="form-grid" onSubmit={submit}>
        <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
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
