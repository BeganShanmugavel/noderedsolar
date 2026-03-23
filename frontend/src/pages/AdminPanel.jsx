import { useState } from 'react';
import { registerUser, uploadSensorCsv } from '../services/api';

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
  const [csvStatus, setCsvStatus] = useState('');
  const [csvSite, setCsvSite] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await registerUser(form);
      const pred = res?.analysis_preview?.predicted_generation;
      setStatus(
        pred
          ? `User registered. Auto telemetry seeded and analyzed. Predicted generation: ${Number(pred).toFixed(2)}`
          : 'User and plant registered successfully by admin.'
      );
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

  const submitCsv = async (e) => {
    e.preventDefault();
    setCsvStatus('');
    if (!csvFile) {
      setCsvStatus('Please choose a CSV file.');
      return;
    }
    try {
      const res = await uploadSensorCsv(csvSite, csvFile);
      setCsvStatus(`CSV uploaded. Rows: ${res.rows_ingested}. Site: ${res.site_identifier}.`);
    } catch (err) {
      setCsvStatus(err.message);
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
      <hr style={{ margin: '18px 0', opacity: 0.25 }} />
      <h3>Sensor CSV Ingestion</h3>
      <p>Upload sensor telemetry CSV and trigger analysis preview for the selected site.</p>
      <form className="form-grid" onSubmit={submitCsv}>
        <input placeholder="Site ID (optional if present in CSV)" value={csvSite} onChange={(e) => setCsvSite(e.target.value)} />
        <input type="file" accept=".csv,text/csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} required />
        <button className="btn-primary" type="submit">Upload Sensor CSV</button>
      </form>
      {csvStatus && <p>{csvStatus}</p>}
    </div>
  );
}
