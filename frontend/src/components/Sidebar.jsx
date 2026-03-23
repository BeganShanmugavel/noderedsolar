import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = [
  ['Overview', '/dashboard'],
  ['Plant Performance', '/performance'],
  ['Panel Health', '/panel-health'],
  ['AI Prediction', '/ai-analysis'],
  ['Operations Planner', '/operations-planner'],
  ['Financial Analytics', '/financials'],
  ['Maintenance Alerts', '/alerts'],
  ['Digital Twin', '/digital-twin'],
  ['Sustainability', '/sustainability'],
];

export default function Sidebar({ mobileOpen = false, onNavigate = () => {} }) {
  const { user } = useAuth();
  return (
    <aside className={`glass sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Solar Command</h3>
        <p>Enterprise Suite Navigation</p>
      </div>
      {items.map(([label, path]) => (
        <Link key={path} to={path} className="nav-link" onClick={onNavigate}>{label}</Link>
      ))}
      {user?.role === 'admin' && <Link to="/admin" onClick={onNavigate} className="nav-link admin-link">User Registration</Link>}
      {user?.role === 'admin' && <Link to="/user-details" onClick={onNavigate} className="nav-link admin-link">User Details</Link>}
    </aside>
  );
}
