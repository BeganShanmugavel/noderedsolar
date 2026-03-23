import { useEffect, useState } from 'react';
import { getAdminUserDetails } from '../services/api';

export default function UserDetails() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminUserDetails().then(setPayload).catch((e) => setError(e.message));
  }, []);

  const summary = payload?.summary || {};
  const users = payload?.users || [];

  return (
    <section>
      <div className="hero-banner glass">
        <h1>User & Plant Details</h1>
        <p>High-level admin view of registered users and their linked panel deployments.</p>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="card-grid">
        <div className="glass card"><h3>Total Users</h3><p>{summary.total_users ?? '--'}</p></div>
        <div className="glass card"><h3>Admins</h3><p>{summary.admin_count ?? '--'}</p></div>
        <div className="glass card"><h3>Users</h3><p>{summary.user_count ?? '--'}</p></div>
        <div className="glass card"><h3>Total Capacity</h3><p>{summary.total_capacity_kw ?? '--'} kW</p></div>
        <div className="glass card"><h3>Total Panels</h3><p>{summary.total_panel_count ?? '--'}</p></div>
      </div>

      <div className="glass chart-wrap" style={{ marginTop: 16, overflowX: 'auto' }}>
        <h3>Registered User Panel Details</h3>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Site</th>
              <th>Plant Location</th>
              <th>Weather City</th>
              <th>kW</th>
              <th>Panels</th>
              <th>Panel Type</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={10}>No users available.</td>
              </tr>
            )}
            {users.map((row) => (
              <tr key={`${row.user_id}-${row.site_identifier || 'na'}`}>
                <td>{row.name || '--'}</td>
                <td>{row.email || '--'}</td>
                <td>{row.role || '--'}</td>
                <td>{row.phone || '--'}</td>
                <td>{row.site_identifier || '--'}</td>
                <td>{row.location || '--'}</td>
                <td>{row.weather_location || '--'}</td>
                <td>{row.capacity_kw ?? '--'}</td>
                <td>{row.panel_count ?? '--'}</td>
                <td>{row.panel_type || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
