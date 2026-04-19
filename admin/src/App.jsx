import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
  Download, Activity, Clock, AlertCircle, RefreshCw, LayoutDashboard,
  LogIn, LogOut, Shield, Globe, Zap, FileDown, Server, TrendingUp,
  AlertTriangle, Eye, ChevronDown, Search, Calendar, Users,
  CheckCircle, XCircle, Wifi, WifiOff, BarChart3, PieChart as PieIcon
} from 'lucide-react';

const API = window.location.hostname === 'localhost' ? 'http://localhost:4000' : window.location.origin;
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
const PLATFORM_COLORS = { youtube: '#ff0000', instagram: '#e4405f', facebook: '#1877f2', twitter: '#000', pinterest: '#bd081c', linkedin: '#0a66c2' };

// ============ LOGIN PAGE ============
function LoginPage({ onLogin }) {
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
      {/* Animated background orbs */}
      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Shield size={28} />
          </div>
          <h1>ClipVora</h1>
          <span className="login-badge">Admin Panel</span>
        </div>

        <p className="login-subtitle">Sign in to access your analytics dashboard</p>

        {error && (
          <div className="login-error">
            <AlertCircle size={14} /> {error}
          </div>
        )}

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

// ============ STAT CARD ============
function StatCard({ icon, color, bg, label, value, sub, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color }}>{icon}</div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{sub}</div>
      </div>
      {trend !== undefined && (
        <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
}

// ============ MAIN DASHBOARD ============
function Dashboard({ token, onLogout }) {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activity, setActivity] = useState([]);
  const [failures, setFailures] = useState(null);
  const [geo, setGeo] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [activityFilter, setActivityFilter] = useState({ status: '', platform: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, a, f, g, p, h] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/charts`, { headers }),
        axios.get(`${API}/admin/activity`, { headers, params: { ...activityFilter, limit: 50 } }),
        axios.get(`${API}/admin/failures`, { headers }),
        axios.get(`${API}/admin/geo`, { headers }),
        axios.get(`${API}/admin/performance`, { headers }),
        axios.get(`${API}/admin/health`, { headers }),
      ]);
      setStats(s.data);
      setCharts(c.data);
      setActivity(a.data);
      setFailures(f.data);
      setGeo(g.data);
      setPerformance(p.data);
      setHealth(h.data);
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

  const exportCsv = () => {
    window.open(`${API}/admin/export?token=${token}`, '_blank');
  };

  // Filter activity by search
  const filteredActivity = useMemo(() => {
    if (!searchQuery) return activity;
    const q = searchQuery.toLowerCase();
    return activity.filter(ev =>
      (ev.platform || '').toLowerCase().includes(q) ||
      (ev.error_type || '').toLowerCase().includes(q) ||
      (ev.country || '').toLowerCase().includes(q) ||
      (ev.status || '').toLowerCase().includes(q)
    );
  }, [activity, searchQuery]);

  // System health score
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
      {/* Header */}
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
            {lastUpdated && (
              <span className="last-updated">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button onClick={exportCsv} className="btn-sm"><FileDown size={14} /> CSV</button>
          <button onClick={fetchAll} className="btn-sm"><RefreshCw size={14} className={loading ? 'spin' : ''} /></button>
          <button onClick={onLogout} className="btn-sm btn-danger"><LogOut size={14} /></button>
        </div>
      </header>

      {error && <div className="alert-bar"><AlertCircle size={14} /> {error}</div>}

      {/* Tabs */}
      <nav className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      {/* ==================== OVERVIEW ==================== */}
      {tab === 'overview' && <>
        <div className="stat-grid">
          <StatCard icon={<Download size={20} />} color="#6366f1" bg="#e0e7ff" label="Total Downloads" value={stats.totalDownloads.toLocaleString()} sub={`${stats.todayDownloads} today`} />
          <StatCard icon={<Activity size={20} />} color="#10b981" bg="#dcfce7" label="Success Rate" value={`${stats.successRate}%`} sub="All downloads" />
          <StatCard icon={<Clock size={20} />} color="#f59e0b" bg="#fef3c7" label="Avg Latency" value={`${stats.avgResponseTime}ms`} sub="Success only" />
          <StatCard icon={<Eye size={20} />} color="#8b5cf6" bg="#ede9fe" label="Total Requests" value={stats.totalInfoRequests.toLocaleString()} sub="URL lookups" />
        </div>

        <div className="grid-2-1">
          <div className="card">
            <h3><BarChart3 size={15} /> Downloads Trend</h3>
            <ChartArea data={charts.downloadsOverTime} />
          </div>
          <div className="card">
            <h3><PieIcon size={15} /> Platform Share</h3>
            <ChartPie data={charts.platformDistribution} />
          </div>
        </div>

        <div className="grid-1-1">
          <div className="card">
            <h3><Clock size={15} /> Peak Hours</h3>
            <ChartBar data={charts.peakHours} />
          </div>
          <div className="card">
            <h3><Server size={15} /> Platform Health (24h)</h3>
            <HealthGrid health={health} />
          </div>
        </div>
      </>}

      {/* ==================== FAILURES ==================== */}
      {tab === 'failures' && failures && <>
        <div className="stat-grid small">
          <StatCard icon={<XCircle size={20} />} color="#ef4444" bg="#fee2e2" label="Total Failures" value={failures.byErrorType.reduce((s, e) => s + parseInt(e.count), 0)} sub="All time" />
          <StatCard icon={<AlertTriangle size={20} />} color="#f59e0b" bg="#fef3c7" label="Top Error" value={failures.byErrorType[0]?.error_type?.split('_').join(' ') || 'None'} sub={`${failures.byErrorType[0]?.count || 0} occurrences`} />
          <StatCard icon={<CheckCircle size={20} />} color="#10b981" bg="#dcfce7" label="Most Stable" value={failures.byPlatform.filter(p => p.failures === '0')[0]?.platform || 'N/A'} sub="0 failures" />
        </div>

        <div className="grid-2-1">
          <div className="card">
            <h3><AlertTriangle size={15} /> Error Types</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={failures.byErrorType} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="error_type" type="category" width={160} stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3>Failure Rate by Platform</h3>
            <div className="scroll-table">
              <table>
                <thead><tr><th>Platform</th><th>Total</th><th>Failed</th><th>Rate</th></tr></thead>
                <tbody>
                  {failures.byPlatform.map((p, i) => (
                    <tr key={i}>
                      <td><span className="platform-dot" style={{ background: PLATFORM_COLORS[p.platform] || '#6366f1' }} />{p.platform}</td>
                      <td>{p.total}</td>
                      <td>{p.failures}</td>
                      <td><span className={`badge ${parseFloat(p.failure_rate) > 30 ? 'bad' : parseFloat(p.failure_rate) > 10 ? 'warn' : 'ok'}`}>{p.failure_rate}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Failure Trend (7 days)</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={failures.failureTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="day" tickFormatter={v => new Date(v).toLocaleDateString([], { weekday: 'short' })} stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} labelFormatter={v => new Date(v).toLocaleDateString()} />
                <Area type="monotone" dataKey="total" stroke="#334155" fill="#1e293b" name="Total" />
                <Area type="monotone" dataKey="failures" stroke="#ef4444" fill="#7f1d1d44" strokeWidth={2} name="Failures" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>}

      {/* ==================== PERFORMANCE ==================== */}
      {tab === 'performance' && performance && <>
        <div className="card">
          <h3><Zap size={15} /> Response Time by Platform</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={performance.byPlatform}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="platform" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="ms" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={v => `${v}ms`} />
                <Bar dataKey="avg_time" fill="#6366f1" radius={[4, 4, 0, 0]} name="Average" />
                <Bar dataKey="max_time" fill="#f59e0b44" radius={[4, 4, 0, 0]} name="Maximum" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid-1-1">
          <div className="card">
            <h3>Performance Summary</h3>
            <div className="scroll-table">
              <table>
                <thead><tr><th>Platform</th><th>Avg</th><th>Min</th><th>Max</th><th>Requests</th></tr></thead>
                <tbody>
                  {performance.byPlatform.map((p, i) => (
                    <tr key={i}>
                      <td><span className="platform-dot" style={{ background: PLATFORM_COLORS[p.platform] || '#6366f1' }} />{p.platform}</td>
                      <td>{p.avg_time}ms</td>
                      <td className="text-green">{p.min_time}ms</td>
                      <td className="text-red">{p.max_time}ms</td>
                      <td>{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h3>Slowest Requests (&gt;10s)</h3>
            <div className="scroll-table">
              <table>
                <thead><tr><th>Platform</th><th>Type</th><th>Time</th><th>When</th></tr></thead>
                <tbody>
                  {performance.slowRequests.length === 0 && <tr><td colSpan={4} className="empty-row">No slow requests detected</td></tr>}
                  {performance.slowRequests.map((r, i) => (
                    <tr key={i}>
                      <td>{r.platform}</td>
                      <td>{r.event_type}</td>
                      <td><span className="badge bad">{(r.response_time / 1000).toFixed(1)}s</span></td>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>}

      {/* ==================== GEOGRAPHY ==================== */}
      {tab === 'geo' && <>
        <div className="card">
          <h3><Globe size={15} /> Downloads by Country</h3>
          {geo.length === 0 ? (
            <div className="empty-state"><Globe size={40} /><p>No geographic data collected yet.<br />Data will appear as users make requests.</p></div>
          ) : (
            <div className="grid-1-1">
              <div style={{ height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={geo.slice(0, 15)} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="country" type="category" width={60} stroke="#64748b" fontSize={12} tick={{ fill: '#e2e8f0' }} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="scroll-table">
                <table>
                  <thead><tr><th>#</th><th>Country</th><th>Downloads</th><th>Share</th></tr></thead>
                  <tbody>
                    {geo.map((g, i) => {
                      const total = geo.reduce((s, x) => s + parseInt(x.count), 0);
                      const pct = ((parseInt(g.count) / total) * 100).toFixed(1);
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td><strong>{g.country}</strong></td>
                          <td>{g.count}</td>
                          <td>
                            <div className="bar-cell">
                              <div className="bar-fill" style={{ width: `${pct}%` }} />
                              <span>{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </>}

      {/* ==================== ACTIVITY LOG ==================== */}
      {tab === 'activity' && <>
        <div className="card">
          <div className="activity-header">
            <h3><Eye size={15} /> Activity Log</h3>
            <div className="activity-controls">
              <div className="search-box">
                <Search size={14} />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <select value={activityFilter.status} onChange={e => setActivityFilter(f => ({ ...f, status: e.target.value }))}>
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
              <select value={activityFilter.platform} onChange={e => setActivityFilter(f => ({ ...f, platform: e.target.value }))}>
                <option value="">All Platforms</option>
                {['youtube', 'instagram', 'facebook', 'twitter', 'pinterest', 'linkedin'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="scroll-table" style={{ maxHeight: 600 }}>
            <table>
              <thead>
                <tr>
                  <th>Platform</th><th>Type</th><th>Status</th><th>Latency</th><th>Country</th><th>Error</th><th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.length === 0 && <tr><td colSpan={7} className="empty-row">No matching events</td></tr>}
                {filteredActivity.map((ev, i) => (
                  <tr key={i} className={ev.status === 'failure' ? 'row-fail' : ''}>
                    <td><span className="platform-dot" style={{ background: PLATFORM_COLORS[ev.platform] || '#6366f1' }} />{ev.platform}</td>
                    <td><span className="type-tag">{ev.event_type}</span></td>
                    <td><span className={`badge ${ev.status === 'success' ? 'ok' : 'bad'}`}>{ev.status}</span></td>
                    <td>{ev.response_time ? `${ev.response_time}ms` : '-'}</td>
                    <td>{ev.country || '-'}</td>
                    <td className="error-cell" title={ev.error_type}>{ev.error_type || '-'}</td>
                    <td className="time-cell">{new Date(ev.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="activity-footer">
            Showing {filteredActivity.length} of {activity.length} events &middot; Auto-refreshes every 30s
          </div>
        </div>
      </>}

    </div>
  );
}

// ============ CHART COMPONENTS ============
function ChartArea({ data }) {
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="day" tickFormatter={v => new Date(v).toLocaleDateString([], { weekday: 'short' })} stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} labelFormatter={v => new Date(v).toLocaleDateString()} />
          <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#gMain)" name="Total" />
          <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={1.5} dot={false} name="Success" />
          <Line type="monotone" dataKey="failure" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Failures" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartPie({ data }) {
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="platform">
            {data.map((entry, i) => <Cell key={i} fill={PLATFORM_COLORS[entry.platform] || COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartBar({ data }) {
  return (
    <div style={{ height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickFormatter={h => `${h}h`} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} labelFormatter={h => `${h}:00 - ${h}:59`} />
          <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HealthGrid({ health }) {
  if (!health.length) return <div className="empty-state"><Server size={32} /><p>No data in last 24h</p></div>;
  return (
    <div className="health-grid">
      {health.map((h, i) => {
        const rate = parseFloat(h.success_rate);
        return (
          <div key={i} className="health-item">
            <div className="health-top">
              <span className="platform-dot" style={{ background: PLATFORM_COLORS[h.platform] || '#6366f1' }} />
              <span className="health-name">{h.platform}</span>
              <span className={`health-pct ${rate > 80 ? 'good' : rate > 50 ? 'warn' : 'bad'}`}>{h.success_rate}%</span>
            </div>
            <div className="health-bar-bg">
              <div className={`health-bar-fill ${rate > 80 ? 'good' : rate > 50 ? 'warn' : 'bad'}`} style={{ width: `${rate}%` }} />
            </div>
            <div className="health-detail">{h.total_24h} req &middot; {h.avg_time_24h || 0}ms avg</div>
          </div>
        );
      })}
    </div>
  );
}

// ============ APP ============
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) return <LoginPage onLogin={setToken} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}

// Styles are loaded from index.css via main.jsx
