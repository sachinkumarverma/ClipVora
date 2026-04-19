import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe } from 'lucide-react';

const tt = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 };

export default function GeoTab({ geo }) {
  return (
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
                <Tooltip contentStyle={tt} />
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
                      <td><div className="bar-cell"><div className="bar-fill" style={{ width: `${pct}%` }} /><span>{pct}%</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
