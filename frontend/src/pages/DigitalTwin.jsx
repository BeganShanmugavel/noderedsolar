export default function DigitalTwin() {
  return (
    <section>
      <div className="hero-banner glass">
        <h1>Digital Twin</h1>
        <p>Compare current telemetry with a synthetic baseline to detect drift early.</p>
      </div>
      <div className="content-grid">
        <div className="glass">
          <h3>Twin Alignment</h3>
          <p>Current deviation: <strong>4.1%</strong> (within acceptable range)</p>
          <p>Thermal deviation: <strong>+1.3°C</strong></p>
        </div>
        <div className="glass">
          <h3>Recommended Action</h3>
          <ul>
            <li>Continue standard cleaning cadence.</li>
            <li>Recalibrate inverter sensor cluster at next service window.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
