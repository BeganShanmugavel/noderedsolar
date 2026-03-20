export default function Performance() {
  const blocks = [
    ['Plant Uptime', '99.2%'],
    ['Avg Irradiation', '458 W/m²'],
    ['Voltage Stability', '96.4%'],
    ['Fleet Efficiency', '91.1%'],
  ];

  return (
    <section>
      <div className="hero-banner glass">
        <h1>Plant Performance</h1>
        <p>Track electrical and environmental performance with trend-ready KPI groups.</p>
      </div>

      <div className="content-grid">
        <div className="glass">
          <h3>Operational KPI Grid</h3>
          <div className="card-grid">
            {blocks.map(([k, v]) => <div className="card" key={k}><h4>{k}</h4><p>{v}</p></div>)}
          </div>
        </div>
        <div className="glass">
          <h3>Performance Insights</h3>
          <ul>
            <li>Generation tracks irradiation in expected range.</li>
            <li>Voltage variance remains within inverter tolerance.</li>
            <li>No prolonged efficiency degradation window detected.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
