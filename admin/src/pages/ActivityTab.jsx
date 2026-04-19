import { useMemo, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { PLATFORM_COLORS, PLATFORMS } from '../constants';

export default function ActivityTab({ activity, activityFilter, setActivityFilter }) {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
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
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="scroll-table" style={{ maxHeight: 600 }}>
        <table>
          <thead>
            <tr>
              <th>Platform</th><th>Type</th><th>Status</th><th>Latency</th><th>Device</th><th>IP</th><th>Country</th><th>Error</th><th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivity.length === 0 && <tr><td colSpan={9} className="empty-row">No matching events</td></tr>}
            {filteredActivity.map((ev, i) => {
              const ip = ev.metadata ? (typeof ev.metadata === 'string' ? JSON.parse(ev.metadata) : ev.metadata)?.ip : null;
              return (
                <tr key={i} className={ev.status === 'failure' ? 'row-fail' : ''}>
                  <td><span className="platform-dot" style={{ background: PLATFORM_COLORS[ev.platform] || '#6366f1' }} />{ev.platform}</td>
                  <td><span className="type-tag">{ev.event_type}</span></td>
                  <td><span className={`badge ${ev.status === 'success' ? 'ok' : 'bad'}`}>{ev.status}</span></td>
                  <td>{ev.response_time ? `${ev.response_time}ms` : '-'}</td>
                  <td><span className="type-tag">{ev.device_type || '-'}</span></td>
                  <td className="ip-cell">{ip || '-'}</td>
                  <td>{ev.country || '-'}</td>
                  <td className="error-cell" title={ev.error_type}>{ev.error_type || '-'}</td>
                  <td className="time-cell">{new Date(ev.created_at).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="activity-footer">
        Showing {filteredActivity.length} of {activity.length} events &middot; Auto-refreshes every 30s
      </div>
    </div>
  );
}
