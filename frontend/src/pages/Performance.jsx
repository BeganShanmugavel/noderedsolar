import { useEffect, useMemo, useState } from 'react';
import { getDashboard } from '../services/api';

export default function Performance() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  const metrics = useMemo(() => {
    const w = data?.window || [];
    if (!w.length) return null;
    const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
    return {
      uptime: data?.advanced_metrics?.stability_score ?? '--',
      irradiation: avg(w.map((x) => Number(x.irradiation || 0))),
      voltage: avg(w.map((x) => Number(x.voltage || 0))),
      efficiency: data?.efficiency?.efficiency?.toFixed?.(2) ?? '--',
    };
  }, [data]);

  return (
    <section>
      <div className="hero-banner glass">
        <h1>Plant Performance</h1>
        <p>Realtime performance derived from internal simulator telemetry windows.</p>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="card-grid">
        <div className="glass card"><h3>Plant Uptime Score</h3><p>{metrics?.uptime ?? '--'}%</p></div>
        <div className="glass card"><h3>Avg Irradiation</h3><p>{metrics?.irradiation ?? '--'} W/m²</p></div>
        <div className="glass card"><h3>Avg Voltage</h3><p>{metrics?.voltage ?? '--'} V</p></div>
        <div className="glass card"><h3>Current Efficiency</h3><p>{metrics?.efficiency ?? '--'}%</p></div>
      </div>
      <div className="glass">
        <h3>Live Analysis</h3>
        <p>Total telemetry points analysed: {data?.window?.length ?? 0}</p>
        <p>Fault prediction: {data?.fault_prediction || 'No immediate fault trend'}</p>
      </div>
    </section>
  );
}
