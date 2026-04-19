import { useState } from 'react';
import axios from 'axios';
import { LogIn, Shield, AlertCircle, RefreshCw, Users } from 'lucide-react';
import { API } from '../constants';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, { username, password });
      localStorage.setItem('admin_token', res.data.token);
      onLogin(res.data.token);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon"><Shield size={28} /></div>
          <h1>ClipVora</h1>
          <span className="login-badge">Admin Panel</span>
        </div>

        <p className="login-subtitle">Sign in to access your analytics dashboard</p>

        {error && <div className="login-error"><AlertCircle size={14} /> {error}</div>}

        <div className="input-group">
          <Users size={16} className="input-icon" />
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
        </div>

        <div className="input-group">
          <Shield size={16} className="input-icon" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? <RefreshCw size={16} className="spin" /> : <LogIn size={16} />}
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <p className="login-footer">Protected by JWT authentication</p>
      </form>
    </div>
  );
}
