import { useEffect, useMemo, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import ChartPanel from '../components/ChartPanel';
import { getDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

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
        <p>Realtime operational intelligence with weather-aware analysis.</p>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="glass" style={{ marginTop: 12 }}>
        <h3>User Details</h3>
        <p><strong>Name:</strong> {user?.name || '--'} | <strong>Role:</strong> {user?.role || '--'}</p>
        <p><strong>Email:</strong> {user?.email || '--'} | <strong>Phone:</strong> {user?.phone || '--'}</p>
      </div>
      <div className="glass" style={{ marginTop: 12 }}>
        <h3>Panel Analysis Details</h3>
        <p>
          <strong>Site:</strong> {data?.plant_profile?.site_identifier || data?.served_site_identifier || '--'} |
          <strong> Location:</strong> {data?.plant_profile?.location || '--'} |
          <strong> Capacity:</strong> {data?.plant_profile?.capacity_kw ?? '--'} kW
        </p>
        <p>
          <strong>Panel Count:</strong> {data?.plant_profile?.panel_count ?? '--'} |
          <strong> Panel Type:</strong> {data?.plant_profile?.panel_type || '--'} |
          <strong> Forecast Next Hr:</strong> {data?.advanced_metrics?.forecast_next_hour_generation ?? '--'} kWh
        </p>
      </div>
      <DashboardCards stats={stats} />
      <div className="card-grid">
        <div className="glass card">
          <h3>Platform Tier</h3>
          <p>{data?.platform_status?.project_tier || 'industrial_prototype'}</p>
        </div>
        <div className="glass card">
          <h3>Telemetry Source</h3>
          <p>{data?.telemetry_source || '--'}</p>
        </div>
        <div className="glass card">
          <h3>LSTM Mode</h3>
          <p>{data?.platform_status?.lstm_mode || '--'}</p>
        </div>
        <div className="glass card">
          <h3>Window Points</h3>
          <p>{data?.platform_status?.window_points ?? '--'}</p>
        </div>
      </div>
      <div className="card-grid">
        <div className="glass card"><h3>Stability Score</h3><p>{data?.advanced_metrics?.stability_score ?? '--'}%</p></div>
        <div className="glass card"><h3>Utilization</h3><p>{data?.advanced_metrics?.utilization_percent ?? '--'}%</p></div>
        <div className="glass card"><h3>Weather Impact</h3><p>{data?.weather_analysis?.weather_impact_summary ?? '--'}</p></div>
        <div className="glass card"><h3>Thermal Note</h3><p>{data?.weather_analysis?.thermal_note ?? '--'}</p></div>
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
