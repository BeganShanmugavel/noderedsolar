import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

export default function AIAnalysis() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  const ai = data?.ai_insights;

  return (
    <section>
      <div className="hero-banner glass">
        <h1>AI Analysis Center</h1>
        <p>Advanced reliability scoring, failure horizon prediction, and confidence intelligence.</p>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="card-grid">
        <div className="glass card"><h3>Degradation Risk</h3><p>{ai?.degradation_risk_score ?? '--'} / 100</p></div>
        <div className="glass card"><h3>Failure Horizon</h3><p>{ai?.predicted_next_failure_hours ?? '--'} hrs</p></div>
        <div className="glass card"><h3>Cleaning Priority</h3><p>{ai?.cleaning_priority_index ?? '--'} / 100</p></div>
        <div className="glass card"><h3>Confidence Band</h3><p>{ai ? `${ai.confidence_band.low} - ${ai.confidence_band.high}` : '--'}</p></div>
      </div>
      <div className="content-grid">
        <div className="glass">
          <h3>Unique AI Flags</h3>
          {ai?.unique_flags?.length ? (
            <ul>{ai.unique_flags.map((f) => <li key={f}>{f}</li>)}</ul>
          ) : <p>No active advanced flags.</p>}
        </div>
        <div className="glass">
          <h3>Operator Playbook (Rule-Based)</h3>
          <ul>
            <li>Schedule inverter calibration if instability flag persists for 3 windows.</li>
            <li>Trigger cleaning workflow when priority index exceeds 70.</li>
            <li>Escalate maintenance when failure horizon drops below 96 hours.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
