import { useEffect, useState } from 'react';
import { getDashboard, getSiteAlerts } from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getDashboard(), getSiteAlerts()])
      .then(([dash, persisted]) => {
        const merged = [...(dash.alerts || []), ...(persisted || [])];
        setAlerts(merged);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section>
      <div className="hero-banner glass">
        <h1>Maintenance Alerts</h1>
        <p>Alerts generated from live simulator telemetry analysis.</p>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="alert-list glass">
        {alerts.length === 0 ? <p>No active alerts.</p> : alerts.map((a, i) => (
          <div key={i} className="alert-item">
            <strong>{a.severity || 'Medium'}</strong>
            <p>{a.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
