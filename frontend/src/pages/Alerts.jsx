const alerts = [
  { severity: 'Critical', message: 'Voltage spike detected at inverter line A.' },
  { severity: 'Medium', message: 'Panel cluster 3 requires cleaning cycle.' },
  { severity: 'Low', message: 'Cloud fluctuation caused temporary generation dip.' },
];

export default function Alerts() {
  return (
    <section>
      <div className="hero-banner glass">
        <h1>Maintenance Alerts</h1>
        <p>Prioritized operational events with actionable recommendations.</p>
      </div>
      <div className="alert-list glass">
        {alerts.map((a, i) => (
          <div key={i} className="alert-item">
            <strong>{a.severity}</strong>
            <p>{a.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
