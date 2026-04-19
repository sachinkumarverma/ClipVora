import { useMemo, useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PLATFORM_COLORS, PLATFORMS } from '../constants';

const PAGE_SIZE = 20;

export default function ActivityTab({ activity, activityFilter, setActivityFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const filteredActivity = useMemo(() => {
    setPage(0);
    if (!searchQuery) return activity;
    const q = searchQuery.toLowerCase();
    return activity.filter(ev =>
      (ev.platform || '').toLowerCase().includes(q) ||
      (ev.error_type || '').toLowerCase().includes(q) ||
      (ev.country || '').toLowerCase().includes(q) ||
      (ev.status || '').toLowerCase().includes(q)
    );
  }, [activity, searchQuery]);

  const totalPages = Math.ceil(filteredActivity.length / PAGE_SIZE);
  const paged = filteredActivity.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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

      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Device</th>
            <th>IP</th>
            <th>Country</th>
            <th>Error</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && <tr><td colSpan={8} className="empty-row">No matching events</td></tr>}
          {paged.map((ev, i) => {
            const meta = ev.metadata ? (typeof ev.metadata === 'string' ? JSON.parse(ev.metadata) : ev.metadata) : {};
            const device = [ev.device_type, meta.device, meta.browser].filter(Boolean).join(' · ');
            return (
              <tr key={i} className={ev.status === 'failure' ? 'row-fail' : ''}>
                <td><span className="platform-dot" style={{ background: PLATFORM_COLORS[ev.platform] || '#6366f1' }} />{ev.platform}</td>
                <td><span className={`badge ${ev.status === 'success' ? 'ok' : 'bad'}`}>{ev.status}</span></td>
                <td>{ev.response_time ? `${ev.response_time}ms` : '-'}</td>
                <td className="device-cell" title={device}>{device || '-'}</td>
                <td className="ip-cell">{meta.ip || '-'}</td>
                <td>{ev.country || '-'}</td>
                <td className="error-cell" title={ev.error_type}>{ev.error_type || '-'}</td>
                <td className="time-cell">{new Date(ev.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-info">
          {filteredActivity.length > 0
            ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filteredActivity.length)} of ${filteredActivity.length}`
            : '0 events'}
        </span>
        <div className="pagination-btns">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="page-btn">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
            let p;
            if (totalPages <= 5) p = idx;
            else if (page < 2) p = idx;
            else if (page > totalPages - 3) p = totalPages - 5 + idx;
            else p = page - 2 + idx;
            return (
              <button key={p} onClick={() => setPage(p)} className={`page-btn ${page === p ? 'active' : ''}`}>
                {p + 1}
              </button>
            );
          })}
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="page-btn">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
