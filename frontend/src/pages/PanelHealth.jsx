import Heatmap from '../components/Heatmap';

export default function PanelHealth() {
  const demo = Array.from({ length: 20 }, (_, i) => ({ panel_id: i + 1, generation: 20 + (i % 6) * 3, isWeak: i % 7 === 0 }));

  return (
    <section>
      <div className="hero-banner glass">
        <h1>Panel Health Matrix</h1>
        <p>Weak module detection and comparative panel output analysis.</p>
      </div>
      <div className="content-grid">
        <Heatmap panels={demo} />
        <div className="glass">
          <h3>Health Highlights</h3>
          <ul>
            <li>3 panels under 70% of plant average.</li>
            <li>String B shows highest consistency.</li>
            <li>Recommend inspection of junction box in row 2.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
