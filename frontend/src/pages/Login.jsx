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

  return (
    <div className="login-screen">
      <div className="pulse-orb" />
      <form className="glass login-card" onSubmit={onSubmit}>
        <h2>Solar AI Platform Login</h2>
        <p className="subtitle">Secure access to all monitoring pages.</p>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  );
}
