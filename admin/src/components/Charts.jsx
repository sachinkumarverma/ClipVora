import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, Line
} from 'recharts';
import { PieChart as PieIcon, Server } from 'lucide-react';
import { COLORS, PLATFORM_COLORS } from '../constants';

const chartTooltip = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 };

export function ChartArea({ data }) {
  const parsed = data.map(d => ({ ...d, count: +d.count || 0, success: +d.success || 0, failure: +d.failure || 0 }));
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={parsed}>
          <defs>
            <linearGradient id="gMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="day" tickFormatter={v => new Date(v).toLocaleDateString([], { weekday: 'short' })} stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip contentStyle={chartTooltip} labelFormatter={v => new Date(v).toLocaleDateString()} />
          <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#gMain)" name="Total" />
          <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={1.5} dot={false} name="Success" />
          <Line type="monotone" dataKey="failure" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Failures" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartPie({ data, nameKey = 'platform', colorMap }) {
  if (!data || data.length === 0) {
    return <div className="empty-state"><PieIcon size={32} /><p>No data yet</p></div>;
  }
  // PostgreSQL returns count as string — convert to number
  const parsed = data.map(d => ({ ...d, count: parseInt(d.count) || 0 }));
  const padding = parsed.length <= 2 ? 0 : 3;
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={parsed} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={padding} minAngle={15} dataKey="count" nameKey={nameKey}>
            {parsed.map((entry, i) => <Cell key={i} fill={(colorMap && colorMap[entry[nameKey]]) || COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={chartTooltip} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartBar({ data }) {
  const parsed = data.map(d => ({ ...d, count: +d.count || 0 }));
  return (
    <div style={{ height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={parsed}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickFormatter={h => `${h}h`} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip contentStyle={chartTooltip} labelFormatter={h => `${h}:00 - ${h}:59`} />
          <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HealthGrid({ health }) {
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
