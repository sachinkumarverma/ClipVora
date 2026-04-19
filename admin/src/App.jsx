import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, RefreshCw, LogOut, FileDown, AlertCircle,
  TrendingUp, AlertTriangle, Zap, Globe, Eye, Wifi, WifiOff
} from 'lucide-react';
import { API } from './constants';
import LoginPage from './pages/LoginPage';
import OverviewTab from './pages/OverviewTab';
import FailuresTab from './pages/FailuresTab';
import PerformanceTab from './pages/PerformanceTab';
import GeoTab from './pages/GeoTab';
import ActivityTab from './pages/ActivityTab';

function Dashboard({ token, onLogout }) {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activity, setActivity] = useState([]);
  const [failures, setFailures] = useState(null);
  const [geo, setGeo] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [health, setHealth] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [activityFilter, setActivityFilter] = useState({ status: '', platform: '' });
  const [lastUpdated, setLastUpdated] = useState(null);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, a, f, g, p, h, d] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/charts`, { headers }),
        axios.get(`${API}/admin/activity`, { headers, params: { ...activityFilter, limit: 50 } }),
        axios.get(`${API}/admin/failures`, { headers }),
        axios.get(`${API}/admin/geo`, { headers }),
        axios.get(`${API}/admin/performance`, { headers }),
        axios.get(`${API}/admin/health`, { headers }),
        axios.get(`${API}/admin/devices`, { headers }),
      ]);
      setStats(s.data); setCharts(c.data); setActivity(a.data);
      setFailures(f.data); setGeo(g.data); setPerformance(p.data);
      setHealth(h.data); setDevices(d.data);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      if (err.response?.status === 401) { onLogout(); return; }
      setError('Failed to load analytics data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [token, activityFilter, headers, onLogout]);

  useEffect(() => {
    fetchAll();
    const i = setInterval(fetchAll, 30000);
    return () => clearInterval(i);
  }, [fetchAll]);

  const healthScore = useMemo(() => {
    if (!health.length) return null;
    const totalSuccess = health.reduce((s, h) => s + parseInt(h.success_24h || 0), 0);
    const totalReqs = health.reduce((s, h) => s + parseInt(h.total_24h || 0), 0);
    return totalReqs > 0 ? Math.round((totalSuccess / totalReqs) * 100) : 100;
  }, [health]);

  if (!stats) {
    return (
      <div className="loading-screen">
        <div className="loading-pulse" />
        <p>Initializing analytics engine...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={14} /> },
    { id: 'failures', label: 'Failures', icon: <AlertTriangle size={14} /> },
    { id: 'performance', label: 'Performance', icon: <Zap size={14} /> },
    { id: 'geo', label: 'Geography', icon: <Globe size={14} /> },
    { id: 'activity', label: 'Activity Log', icon: <Eye size={14} /> },
  ];

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="header-left">
          <h1><LayoutDashboard size={20} /> ClipVora Admin</h1>
          <div className="header-meta">
            {healthScore !== null && (
              <span className={`health-pill ${healthScore > 80 ? 'good' : healthScore > 50 ? 'warn' : 'bad'}`}>
                {healthScore > 80 ? <Wifi size={12} /> : <WifiOff size={12} />}
                System {healthScore}%
              </span>
            )}
            {lastUpdated && <span className="last-updated">Updated {lastUpdated.toLocaleTimeString()}</span>}
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => window.open(`${API}/admin/export?token=${token}`, '_blank')} className="btn-sm"><FileDown size={14} /> CSV</button>
          <button onClick={fetchAll} className="btn-sm"><RefreshCw size={14} className={loading ? 'spin' : ''} /></button>
          <button onClick={onLogout} className="btn-sm btn-danger"><LogOut size={14} /></button>
        </div>
      </header>

      {error && <div className="alert-bar"><AlertCircle size={14} /> {error}</div>}

      <nav className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      {tab === 'overview' && <OverviewTab stats={stats} charts={charts} devices={devices} health={health} />}
      {tab === 'failures' && <FailuresTab failures={failures} />}
      {tab === 'performance' && <PerformanceTab performance={performance} />}
      {tab === 'geo' && <GeoTab geo={geo} />}
      {tab === 'activity' && <ActivityTab activity={activity} activityFilter={activityFilter} setActivityFilter={setActivityFilter} />}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) return <LoginPage onLogin={setToken} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
