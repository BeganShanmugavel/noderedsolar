import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginSession } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      loginSession(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginAs = (role) => {
    if (role === 'admin') {
      setEmail('admin@solar.local');
      setPassword('Admin@123');
    } else {
      setEmail('user@solar.local');
      setPassword('User@123');
    }
  };

  return (
    <div className="login-screen">
      <div className="pulse-orb" />
      <form className="glass login-card" onSubmit={onSubmit}>
        <h2>Solar AI Platform Login</h2>
        <p className="subtitle">Choose Admin/User demo credentials or enter your own.</p>
        <div className="role-switch">
          <button type="button" className="btn-secondary" onClick={() => loginAs('admin')}>Use Admin</button>
          <button type="button" className="btn-secondary" onClick={() => loginAs('user')}>Use User</button>
        </div>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  );
}
