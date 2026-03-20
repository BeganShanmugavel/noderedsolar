export default function Financials() {
  return (
    <section>
      <div className="hero-banner glass">
        <h1>Financial Analytics</h1>
        <p>Revenue, maintenance overhead, and operating margin snapshots for decision makers.</p>
      </div>
      <div className="card-grid">
        <div className="glass card"><h3>Daily Revenue</h3><p>$1,284</p></div>
        <div className="glass card"><h3>Monthly Revenue</h3><p>$38,540</p></div>
        <div className="glass card"><h3>Maintenance Cost</h3><p>$2,460</p></div>
        <div className="glass card"><h3>Net Profit</h3><p>$36,080</p></div>
      </div>
      <div className="glass">
        <h3>Cost Optimization Notes</h3>
        <ul>
          <li>Schedule panel cleaning this week to preserve output ratio.</li>
          <li>Reduce peak-hour inverter stress through staggered balancing.</li>
        </ul>
      </div>
    </section>
  );
}
