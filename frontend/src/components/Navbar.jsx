import { Link } from 'react-router-dom';

const links = [
  ['Dashboard', '/dashboard'],
  ['Analytics', '/performance'],
  ['AI Prediction', '/ai-analysis'],
  ['Financial', '/financials'],
  ['Alerts', '/alerts'],
  ['Profile', '/sustainability'],
];

export default function Navbar() {
  return (
    <nav className="glass row">
      {links.map(([label, path]) => (
        <Link key={path} to={path} className="nav-link">{label}</Link>
      ))}
    </nav>
  );
}
