export default function DashboardCards({ stats = {} }) {
  const cards = [
    ['Actual Generation', `${stats.actual_generation ?? '--'} kWh`],
    ['Predicted Generation', `${Math.round(stats.predicted_generation ?? 0)} kWh`],
    ['Efficiency', `${Math.round(stats.efficiency ?? 0)} %`],
    ['Carbon Offset', `${stats.carbon_offset_kg ?? 0} kg`],
  ];
  return (
    <div className="card-grid">
      {cards.map(([k, v]) => (
        <div className="glass card" key={k}>
          <h3>{k}</h3><p>{v}</p>
        </div>
      ))}
    </div>
  );
}
