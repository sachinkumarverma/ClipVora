import { useMemo, useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet, Bot, Globe } from 'lucide-react';
import { PLATFORM_COLORS, PLATFORMS } from '../constants';

const PAGE_SIZE = 15;

const DeviceIcon = ({ type }) => {
  const size = 13;
  if (type === 'mobile') return <Smartphone size={size} />;
  if (type === 'tablet') return <Tablet size={size} />;
  if (type === 'bot') return <Bot size={size} />;
  return <Monitor size={size} />;
};

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
      (ev.status || '').toLowerCase().includes(q) ||
      (ev.device_type || '').toLowerCase().includes(q)
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

      {/* Activity rows */}
      <div className="activity-list">
        {paged.length === 0 && <div className="empty-state"><Eye size={32} /><p>No matching events</p></div>}
        {paged.map((ev, i) => {
          const meta = ev.metadata ? (typeof ev.metadata === 'string' ? JSON.parse(ev.metadata) : ev.metadata) : {};
          return (
            <div key={i} className={`activity-row ${ev.status === 'failure' ? 'row-fail' : ''}`}>
              <div className="activity-row-left">
                <span className="platform-dot-lg" style={{ background: PLATFORM_COLORS[ev.platform] || '#6366f1' }} />
                <div className="activity-row-main">
                  <div className="activity-row-top">
                    <span className="activity-platform">{ev.platform}</span>
                    <span className="type-tag">{ev.event_type}</span>
                    <span className={`badge ${ev.status === 'success' ? 'ok' : 'bad'}`}>{ev.status}</span>
                    {ev.response_time && <span className="activity-latency">{ev.response_time}ms</span>}
                  </div>
                  <div className="activity-row-bottom">
                    <span className="activity-detail"><DeviceIcon type={ev.device_type} /> {meta.device || ev.device_type || '-'}</span>
                    {meta.browser && <span className="activity-detail">{meta.browser}</span>}
                    {meta.ip && <span className="activity-detail ip-cell">{meta.ip}</span>}
                    {ev.country && <span className="activity-detail"><Globe size={11} /> {ev.country}</span>}
                    {ev.error_type && <span className="activity-detail activity-error">{ev.error_type}</span>}
                  </div>
                </div>
              </div>
              <div className="activity-row-time">
                {new Date(ev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                <span>{new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-info">
          {filteredActivity.length > 0
            ? `${page * PAGE_SIZE + 1}-${Math.min((page + 1) * PAGE_SIZE, filteredActivity.length)} of ${filteredActivity.length}`
            : '0 events'}
        </span>
        <div className="pagination-btns">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="page-btn">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
            let p;
            if (totalPages <= 7) {
              p = idx;
            } else if (page < 3) {
              p = idx;
            } else if (page > totalPages - 4) {
              p = totalPages - 7 + idx;
            } else {
              p = page - 3 + idx;
            }
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
