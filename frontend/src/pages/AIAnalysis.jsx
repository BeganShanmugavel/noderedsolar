export default function AIAnalysis() {
  return (
    <section>
      <div className="hero-banner glass">
        <h1>AI Analysis Center</h1>
        <p>Forecasting, anomaly intelligence, and pre-failure diagnostics in one workspace.</p>
      </div>
      <div className="content-grid">
        <div className="glass">
          <h3>Prediction Summary</h3>
          <p>Next-hour generation confidence: <strong>88%</strong></p>
          <p>Anomaly probability: <strong>Low</strong></p>
          <p>Fault risk trend: <strong>Stable</strong></p>
        </div>
        <div className="glass">
          <h3>Model Explainability</h3>
          <ul>
            <li>Most influential factors: irradiation and temperature.</li>
            <li>Current window quality: 25/25 telemetry points.</li>
            <li>Outlier detector threshold healthy for last 8 cycles.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
