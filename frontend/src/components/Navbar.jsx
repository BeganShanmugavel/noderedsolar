import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Dashboard', '/dashboard'],
  ['Analytics', '/performance'],
  ['AI Prediction', '/ai-analysis'],
  ['Planner', '/operations-planner'],
  ['Financial', '/financials'],
  ['Alerts', '/alerts'],
];

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  return (
    <header className="glass top-header">
      <div className="brand-row">
        <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">☰</button>
        <div>
          <h1 className="brand-title">Solar Command Center</h1>
          <p className="brand-subtitle">Industrial Monitoring SaaS</p>
        </div>
      </div>

      <nav className="row nav-enhanced">
        {links.map(([label, path]) => (
          <Link key={path} to={path} className="nav-link">{label}</Link>
        ))}
        <span className="badge">{user?.role || 'guest'}</span>
        <button className="btn-primary" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
