import { Link } from 'react-router-dom';

const aiFeatures = [
  {
    title: 'AI Generation Forecasting (LSTM)',
    desc: 'Forecast next power output using telemetry trends to plan operations and maximize yield.',
  },
  {
    title: 'Anomaly Intelligence Engine',
    desc: 'Detect hidden voltage, temperature, and generation anomalies before they impact uptime.',
  },
  {
    title: 'Pre-Failure Fault Prediction',
    desc: 'Estimate failure horizon and risk score so teams can act before critical downtime.',
  },
  {
    title: 'Predictive Maintenance Priority',
    desc: 'AI-backed cleaning and maintenance priority index for cost-efficient field execution.',
  },
  {
    title: 'Panel Health Heat Intelligence',
    desc: 'Pinpoint weak rooftop panels using comparative health analytics and generation ratios.',
  },
  {
    title: 'AI-Driven Profit Visibility',
    desc: 'Connect technical performance with revenue, margin, and sustainability KPIs in one view.',
  },
];

const plans = [
  { name: 'Starter', who: 'Small rooftop operators', value: 'AI dashboard + basic alerts' },
  { name: 'Professional', who: 'Growing solar businesses', value: 'Advanced AI insights + planner' },
  { name: 'Enterprise', who: 'Multi-site industrial fleets', value: 'Full predictive suite + admin workflows' },
];

export default function Home() {
  return (
    <section>
      <div className="hero-banner glass marketing-hero">
        <p className="hero-tag">AI-Powered Solar SaaS</p>
        <h1>AI Based Predictive Analysis of Rooftop Solar System</h1>
        <p>
          Transform rooftop solar operations with predictive analytics, anomaly intelligence,
          pre-failure alerts, and executive-ready performance insights.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Start Now</Link>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>View Live Demo</Link>
        </div>
      </div>

      <div className="card-grid" style={{ marginTop: 16 }}>
        {aiFeatures.map((f) => (
          <article className="glass card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </article>
        ))}
      </div>

      <div className="content-grid">
        <div className="glass">
          <h3>Why Solar Businesses Choose This Platform</h3>
          <ul>
            <li>Increase generation reliability with AI-led preventive decisions.</li>
            <li>Reduce maintenance costs via risk-ranked interventions.</li>
            <li>Improve customer trust with transparent KPI reporting.</li>
            <li>Scale from one rooftop site to enterprise solar portfolios.</li>
          </ul>
        </div>
        <div className="glass">
          <h3>Business Impact Snapshot</h3>
          <p><strong>Up to 18%</strong> better maintenance response efficiency.</p>
          <p><strong>Lower downtime risk</strong> through early warning indicators.</p>
          <p><strong>Faster decisions</strong> for operations, engineering, and finance teams.</p>
        </div>
      </div>

      <div className="glass" style={{ marginTop: 14 }}>
        <h3>Plans for Every Stage</h3>
        <div className="task-grid">
          {plans.map((p) => (
            <div className="task-card" key={p.name}>
              <strong>{p.name}</strong>
              <p>{p.who}</p>
              <p>{p.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
