export default function Heatmap({ panels = [] }) {
  return (
    <div className="glass chart-wrap">
      <h3>Panel Heatmap</h3>
      <div className="heatmap-grid">
        {panels.map((panel) => {
          const weak = panel.isWeak;
          return (
            <div key={panel.panel_id} className={`panel-cell ${weak ? 'weak' : 'strong'}`}>
              P{panel.panel_id}: {panel.generation}
            </div>
          );
        })}
      </div>
    </div>
  );
}
