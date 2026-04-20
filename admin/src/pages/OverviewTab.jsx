import { Download, Activity, Clock, Eye, Users, Server, BarChart3, PieChart as PieIcon } from 'lucide-react';
import StatCard from '../components/StatCard';
import { ChartArea, ChartPie, ChartBar, HealthGrid } from '../components/Charts';
import { PLATFORM_COLORS, DEVICE_COLORS } from '../constants';

export default function OverviewTab({ stats, charts, devices, health }) {
  return (
    <>
      <div className="stat-grid">
        <StatCard icon={<Download size={20} />} color="#6366f1" bg="#e0e7ff" label="Total Downloads" value={stats.totalDownloads.toLocaleString()} sub={`${stats.todayDownloads} today`} />
        <StatCard icon={<Activity size={20} />} color="#10b981" bg="#dcfce7" label="Success Rate" value={`${stats.successRate}%`} sub="All downloads" />
        <StatCard icon={<Clock size={20} />} color="#f59e0b" bg="#fef3c7" label="Avg Latency" value={`${stats.avgResponseTime}ms`} sub="Success only" />
        <StatCard icon={<Eye size={20} />} color="#8b5cf6" bg="#ede9fe" label="Total Requests" value={stats.totalInfoRequests.toLocaleString()} sub="URL lookups" />
      </div>

      {/* Row 1: Downloads Trend + Platform Share (equal) */}
      <div className="grid-1-1">
        <div className="card">
          <h3><BarChart3 size={15} /> Downloads Trend</h3>
          <ChartArea data={charts.downloadsOverTime} />
        </div>
        <div className="card">
          <h3><PieIcon size={15} /> Platform Share</h3>
          <ChartPie data={charts.platformDistribution} nameKey="platform" colorMap={PLATFORM_COLORS} />
        </div>
      </div>

      {/* Row 2: Peak Hours + Device Distribution (equal) */}
      <div className="grid-1-1">
        <div className="card">
          <h3><Clock size={15} /> Peak Hours</h3>
          <ChartBar data={charts.peakHours} />
        </div>
        <div className="card">
          <h3><Users size={15} /> Device Distribution</h3>
          <ChartPie data={devices} nameKey="device_type" colorMap={DEVICE_COLORS} />
        </div>
      </div>

      {/* Row 3: Platform Health (full width) */}
      <div className="card">
        <h3><Server size={15} /> Platform Health</h3>
        <HealthGrid health={health} />
      </div>
    </>
  );
}
