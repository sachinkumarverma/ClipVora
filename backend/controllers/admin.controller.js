const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { jwtSecret, adminUsername, adminPassword } = require('../config');

const login = async (req, res) => {
  const { username, password } = req.body;
  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '24h' });
  res.json({ token });
};

// Build date filter clause from ?days=7 query param
const dateFilter = (req, alias = '') => {
  const days = parseInt(req.query.days);
  if (!days || days <= 0) return { clause: '', params: [], idx: 1 };
  const col = alias ? `${alias}.created_at` : 'created_at';
  return { clause: `AND ${col} > NOW() - INTERVAL '${days} days'`, params: [], idx: 1 };
};

const getStats = async (req, res) => {
  try {
    const df = dateFilter(req);
    const [totalRes, successRes, avgRes, infoRes, todayRes] = await Promise.all([
      query(`SELECT COUNT(*) FROM analytics_events WHERE event_type = 'download' ${df.clause}`),
      query(`SELECT (COUNT(*) FILTER (WHERE status = 'success')::float / NULLIF(COUNT(*), 0) * 100) as rate FROM analytics_events WHERE event_type = 'download' ${df.clause}`),
      query(`SELECT AVG(response_time) as avg FROM analytics_events WHERE status = 'success' ${df.clause}`),
      query(`SELECT COUNT(*) FROM analytics_events WHERE event_type = 'info' ${df.clause}`),
      query(`SELECT COUNT(*) FROM analytics_events WHERE event_type = 'download' AND created_at > CURRENT_DATE`),
    ]);

    res.json({
      totalDownloads: parseInt(totalRes.rows[0].count),
      successRate: parseFloat(successRes.rows[0].rate || 0).toFixed(1),
      avgResponseTime: Math.round(avgRes.rows[0].avg || 0),
      totalInfoRequests: parseInt(infoRes.rows[0].count),
      todayDownloads: parseInt(todayRes.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCharts = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const df = dateFilter(req);
    const [overTimeRes, distRes, peakRes] = await Promise.all([
      query(`
        SELECT DATE_TRUNC('day', created_at) as day, COUNT(*) as count,
               COUNT(*) FILTER (WHERE status = 'success') as success,
               COUNT(*) FILTER (WHERE status = 'failure') as failure
        FROM analytics_events
        WHERE event_type = 'download' AND created_at > NOW() - INTERVAL '${days} days'
        GROUP BY day ORDER BY day ASC
      `),
      query(`SELECT platform, COUNT(*) as count FROM analytics_events WHERE event_type = 'download' ${df.clause} GROUP BY platform ORDER BY count DESC`),
      query(`SELECT EXTRACT(HOUR FROM created_at)::int as hour, COUNT(*) as count FROM analytics_events WHERE 1=1 ${df.clause} GROUP BY hour ORDER BY hour ASC`),
    ]);

    res.json({
      downloadsOverTime: overTimeRes.rows,
      platformDistribution: distRes.rows,
      peakHours: peakRes.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const { limit = 50, status, platform } = req.query;
    const df = dateFilter(req);
    const conditions = [`1=1 ${df.clause}`];
    const params = [];
    let idx = 1;

    if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
    if (platform) { conditions.push(`platform = $${idx++}`); params.push(platform); }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const result = await query(
      `SELECT id, event_type, platform, status, response_time, country, error_type, metadata, user_agent, device_type, created_at
       FROM analytics_events ${where} ORDER BY created_at DESC LIMIT $${idx}`,
      [...params, parseInt(limit)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFailures = async (req, res) => {
  try {
    const df = dateFilter(req);
    const days = parseInt(req.query.days) || 7;
    const [byType, byPlatform, trend] = await Promise.all([
      query(`SELECT COALESCE(error_type, 'unknown') as error_type, COUNT(*) as count FROM analytics_events WHERE status = 'failure' ${df.clause} GROUP BY error_type ORDER BY count DESC LIMIT 10`),
      query(`
        SELECT platform, COUNT(*) as total,
               COUNT(*) FILTER (WHERE status = 'failure') as failures,
               ROUND(COUNT(*) FILTER (WHERE status = 'failure')::numeric / NULLIF(COUNT(*), 0) * 100, 1) as failure_rate
        FROM analytics_events WHERE event_type = 'download' ${df.clause} GROUP BY platform ORDER BY failure_rate DESC
      `),
      query(`
        SELECT DATE_TRUNC('day', created_at) as day,
               COUNT(*) FILTER (WHERE status = 'failure') as failures, COUNT(*) as total
        FROM analytics_events WHERE created_at > NOW() - INTERVAL '${days} days' GROUP BY day ORDER BY day ASC
      `),
    ]);

    res.json({ byErrorType: byType.rows, byPlatform: byPlatform.rows, failureTrend: trend.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGeo = async (req, res) => {
  try {
    const df = dateFilter(req);
    const result = await query(`
      SELECT COALESCE(country, 'Unknown') as country, COUNT(*) as count
      FROM analytics_events WHERE country IS NOT NULL AND country != '' ${df.clause} GROUP BY country ORDER BY count DESC LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPerformance = async (req, res) => {
  try {
    const df = dateFilter(req);
    const [byPlatform, slowRequests] = await Promise.all([
      query(`
        SELECT platform, ROUND(AVG(response_time)) as avg_time, MIN(response_time) as min_time, MAX(response_time) as max_time, COUNT(*) as total
        FROM analytics_events WHERE status = 'success' AND response_time IS NOT NULL ${df.clause} GROUP BY platform ORDER BY avg_time DESC
      `),
      query(`SELECT platform, event_type, response_time, created_at FROM analytics_events WHERE response_time > 10000 AND status = 'success' ${df.clause} ORDER BY response_time DESC LIMIT 10`),
    ]);
    res.json({ byPlatform: byPlatform.rows, slowRequests: slowRequests.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHealth = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 1;
    const result = await query(`
      SELECT platform, COUNT(*) as total_24h,
             COUNT(*) FILTER (WHERE status = 'success') as success_24h,
             ROUND(AVG(response_time) FILTER (WHERE status = 'success')) as avg_time_24h,
             ROUND(COUNT(*) FILTER (WHERE status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100, 1) as success_rate
      FROM analytics_events WHERE created_at > NOW() - INTERVAL '${days} days' GROUP BY platform ORDER BY total_24h DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDevices = async (req, res) => {
  try {
    const df = dateFilter(req);
    const result = await query(`
      SELECT COALESCE(device_type, 'unknown') as device_type, COUNT(*) as count
      FROM analytics_events WHERE 1=1 ${df.clause} GROUP BY device_type ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const exportCsv = async (req, res) => {
  try {
    const df = dateFilter(req);
    const result = await query(
      `SELECT id, event_type, platform, status, response_time, country, error_type, device_type, created_at FROM analytics_events WHERE 1=1 ${df.clause} ORDER BY created_at DESC LIMIT 10000`
    );

    const headers = ['id', 'event_type', 'platform', 'status', 'response_time', 'country', 'error_type', 'device_type', 'created_at'];
    const csv = [
      headers.join(','),
      ...result.rows.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="clipvora_analytics_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, getStats, getCharts, getActivity, getFailures, getGeo, getPerformance, getHealth, getDevices, exportCsv };
