import { Link } from 'react-router-dom';

const items = [
  ['Overview', '/dashboard'],
  ['Plant Performance', '/performance'],
  ['Panel Health', '/panel-health'],
  ['AI Prediction', '/ai-analysis'],
  ['Financial Analytics', '/financials'],
  ['Maintenance Alerts', '/alerts'],
  ['Admin Panel', '/admin'],
  ['Digital Twin', '/digital-twin'],
];

export default function Sidebar() {
  return (
    <aside className="glass sidebar">
      {items.map(([label, path]) => (
        <Link key={path} to={path} className="nav-link">{label}</Link>
      ))}
    </aside>
  );
}
