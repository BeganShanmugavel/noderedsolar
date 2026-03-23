import { useEffect, useMemo, useState } from 'react';
import Heatmap from '../components/Heatmap';
import { getDashboard } from '../services/api';

export default function PanelHealth() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  const panels = useMemo(() => {
    const p = data?.latest?.panels || [];
    const weak = new Set(data?.panel_health?.weak_panels || []);
    return p.map((x) => ({ ...x, isWeak: weak.has(x.panel_id) }));
  }, [data]);

  return (
    <section>
      <div className="hero-banner glass">
        <h1>Panel Health Matrix</h1>
        <p>Panel analysis from actual simulator payload panels[] data.</p>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="content-grid">
        <Heatmap panels={panels} />
        <div className="glass">
          <h3>Health Highlights</h3>
          <ul>
            <li>Plant average generation: {data?.panel_health?.plant_average?.toFixed?.(2) ?? '--'}</li>
            <li>Weak panel count: {data?.panel_health?.weak_panels?.length ?? 0}</li>
            <li>Telemetry window analyzed: {data?.window?.length ?? 0} records</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
