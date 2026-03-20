import { useEffect, useMemo, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import ChartPanel from '../components/ChartPanel';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then(setData).catch((e) => setError(e.message));
    const id = setInterval(() => {
      getDashboard().then(setData).catch(() => {});
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const stats = {
    actual_generation: data?.latest?.actual_generation,
    predicted_generation: data?.predicted_generation,
    efficiency: data?.efficiency?.efficiency,
    carbon_offset_kg: data?.carbon_offset_kg,
  };

  const chartData = useMemo(
    () => (data?.window || []).map((row) => ({ ...row, predicted_generation: data?.predicted_generation || row.actual_generation })),
    [data]
  );

  return (
    <section>
      <div className="hero-banner glass">
        <h1>Industrial Solar Command Center</h1>
        <p>Realtime operational intelligence with AI-backed reliability and maintenance foresight.</p>
      </div>

      {error && <p className="error-msg">{error}</p>}
      <DashboardCards stats={stats} />

      <div className="card-grid">
        <div className="glass card"><h3>Stability Score</h3><p>{data?.advanced_metrics?.stability_score ?? '--'}%</p></div>
        <div className="glass card"><h3>Utilization</h3><p>{data?.advanced_metrics?.utilization_percent ?? '--'}%</p></div>
        <div className="glass card"><h3>Forecast Next Hour</h3><p>{data?.advanced_metrics?.forecast_next_hour_generation ?? '--'} kWh</p></div>
        <div className="glass card"><h3>Weather</h3><p>{data?.weather?.location ?? '--'} / Cloud {data?.weather?.cloud_cover ?? '--'}%</p></div>
      </div>

      <ChartPanel data={chartData} />

      <div className="glass chart-wrap">
        <h3>Live Alerts</h3>
        {(data?.alerts || []).length === 0 ? <p>No active alerts.</p> : (
          <ul>{data.alerts.map((a, idx) => <li key={idx}><strong>{a.severity}</strong> - {a.message}</li>)}</ul>
        )}
      </div>
    </section>
  );
}
