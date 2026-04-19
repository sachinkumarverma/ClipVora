import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';
import { PLATFORM_COLORS } from '../constants';

const tt = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 };

export default function PerformanceTab({ performance }) {
  if (!performance) return null;

  return (
    <>
      <div className="card">
        <h3><Zap size={15} /> Response Time by Platform</h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={performance.byPlatform}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="platform" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="ms" />
              <Tooltip contentStyle={tt} formatter={v => `${v}ms`} />
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
    </>
  );
}
