const checklist = [
  'Verify inverter room temperature and ventilation',
  'Inspect panel strings flagged in heatmap',
  'Confirm MQTT telemetry continuity for all sites',
  'Review unresolved maintenance alerts',
  'Update daily shift handover notes',
];

const tasks = [
  { owner: 'Shift A', task: 'Panel cleaning block-2', priority: 'High', status: 'In Progress' },
  { owner: 'Maintenance', task: 'Inverter fan inspection', priority: 'Medium', status: 'Planned' },
  { owner: 'Ops Lead', task: 'Weekly performance review', priority: 'Low', status: 'Open' },
];

export default function OperationsPlanner() {
  return (
    <section>
      <div className="hero-banner glass">
        <h1>Operations Planner (Own Feature)</h1>
        <p>Rule-based shift planning and maintenance execution board without AI/copilot dependency.</p>
      </div>

      <div className="content-grid">
        <div className="glass">
          <h3>Shift Checklist</h3>
          <ul>
            {checklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="glass">
          <h3>Execution Board</h3>
          <div className="task-grid">
            {tasks.map((t, idx) => (
              <div className="task-card" key={idx}>
                <strong>{t.task}</strong>
                <p>Owner: {t.owner}</p>
                <p>Priority: {t.priority}</p>
                <p>Status: {t.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
