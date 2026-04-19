import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { XCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { PLATFORM_COLORS } from '../constants';

const tt = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 };

export default function FailuresTab({ failures }) {
  if (!failures) return null;

  return (
    <>
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
                <Tooltip contentStyle={tt} />
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
              <Tooltip contentStyle={tt} labelFormatter={v => new Date(v).toLocaleDateString()} />
              <Area type="monotone" dataKey="total" stroke="#334155" fill="#1e293b" name="Total" />
              <Area type="monotone" dataKey="failures" stroke="#ef4444" fill="#7f1d1d44" strokeWidth={2} name="Failures" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
