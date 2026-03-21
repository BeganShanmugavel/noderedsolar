import { Link } from 'react-router-dom';

export default function PublicHeader() {
  return (
    <header className="glass public-header">
      <div>
        <h1 className="brand-title">AI Based Predictive Analysis of Rooftop Solar System</h1>
        <p className="brand-subtitle">Enterprise AI Monitoring • Predictive Maintenance • Revenue Intelligence</p>
      </div>
      <div className="header-cta-group">
        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Request Demo</Link>
      </div>
    </header>
  );
}
