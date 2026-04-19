const { query } = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'clipvora_default_secret';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// ============ AUTH ============
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

const authMiddleware = (req, res, next) => {
  // Support token via header or query param (for CSV export)
  const authHeader = req.headers.authorization;
  const queryToken = req.query.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : queryToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ============ DASHBOARD STATS ============
const getDashboardStats = async (req, res) => {
  try {
    const { from, to, platform } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (from) { conditions.push(`created_at >= $${idx++}`); params.push(from); }
    if (to) { conditions.push(`created_at <= $${idx++}`); params.push(to); }
    if (platform) { conditions.push(`platform = $${idx++}`); params.push(platform); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const downloadWhere = conditions.length > 0
      ? `WHERE event_type = 'download' AND ${conditions.join(' AND ')}`
      : `WHERE event_type = 'download'`;

    const [totalRes, successRes, avgRes, infoRes, todayRes] = await Promise.all([
      query(`SELECT COUNT(*) FROM analytics_events ${downloadWhere}`, params),
      query(`SELECT (COUNT(*) FILTER (WHERE status = 'success')::float / NULLIF(COUNT(*), 0) * 100) as rate FROM analytics_events ${downloadWhere}`, params),
      query(`SELECT AVG(response_time) as avg FROM analytics_events ${where.replace('WHERE', 'WHERE status = \'success\' AND') || 'WHERE status = \'success\''}`, params),
      query(`SELECT COUNT(*) FROM analytics_events ${where.replace('WHERE', 'WHERE event_type = \'info\' AND') || 'WHERE event_type = \'info\''}`, params),
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

// ============ CHART DATA ============
const getChartData = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const [overTimeRes, distRes, peakRes] = await Promise.all([
      query(`
        SELECT DATE_TRUNC('day', created_at) as day, COUNT(*) as count,
               COUNT(*) FILTER (WHERE status = 'success') as success,
               COUNT(*) FILTER (WHERE status = 'failure') as failure
        FROM analytics_events
        WHERE event_type = 'download' AND created_at > NOW() - INTERVAL '${parseInt(days)} days'
        GROUP BY day ORDER BY day ASC
      `),
      query(`
        SELECT platform, COUNT(*) as count
        FROM analytics_events WHERE event_type = 'download'
        GROUP BY platform ORDER BY count DESC
      `),
      query(`
        SELECT EXTRACT(HOUR FROM created_at)::int as hour, COUNT(*) as count
        FROM analytics_events
        GROUP BY hour ORDER BY hour ASC
      `),
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

// ============ FAILURE BREAKDOWN ============
const getFailureBreakdown = async (req, res) => {
  try {
    const [byType, byPlatform, trend] = await Promise.all([
      query(`
        SELECT COALESCE(error_type, 'unknown') as error_type, COUNT(*) as count
        FROM analytics_events WHERE status = 'failure'
        GROUP BY error_type ORDER BY count DESC LIMIT 10
      `),
      query(`
        SELECT platform, COUNT(*) as total,
               COUNT(*) FILTER (WHERE status = 'failure') as failures,
               ROUND(COUNT(*) FILTER (WHERE status = 'failure')::numeric / NULLIF(COUNT(*), 0) * 100, 1) as failure_rate
        FROM analytics_events WHERE event_type = 'download'
        GROUP BY platform ORDER BY failure_rate DESC
      `),
      query(`
        SELECT DATE_TRUNC('day', created_at) as day,
               COUNT(*) FILTER (WHERE status = 'failure') as failures,
               COUNT(*) as total
        FROM analytics_events
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY day ORDER BY day ASC
      `),
    ]);

    res.json({
      byErrorType: byType.rows,
      byPlatform: byPlatform.rows,
      failureTrend: trend.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============ GEO ANALYTICS ============
const getGeoAnalytics = async (req, res) => {
  try {
    const result = await query(`
      SELECT COALESCE(country, 'Unknown') as country, COUNT(*) as count
      FROM analytics_events
      WHERE country IS NOT NULL AND country != ''
      GROUP BY country ORDER BY count DESC LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============ PERFORMANCE METRICS ============
const getPerformanceMetrics = async (req, res) => {
  try {
    const [byPlatform, slowRequests] = await Promise.all([
      query(`
        SELECT platform,
               ROUND(AVG(response_time)) as avg_time,
               MIN(response_time) as min_time,
               MAX(response_time) as max_time,
               COUNT(*) as total
        FROM analytics_events
        WHERE status = 'success' AND response_time IS NOT NULL
        GROUP BY platform ORDER BY avg_time DESC
      `),
      query(`
        SELECT platform, event_type, response_time, created_at
        FROM analytics_events
        WHERE response_time > 10000 AND status = 'success'
        ORDER BY response_time DESC LIMIT 10
      `),
    ]);

    res.json({
      byPlatform: byPlatform.rows,
      slowRequests: slowRequests.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============ RECENT ACTIVITY ============
const getRecentActivity = async (req, res) => {
  try {
    const { limit = 30, status, platform } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
    if (platform) { conditions.push(`platform = $${idx++}`); params.push(platform); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT * FROM analytics_events ${where} ORDER BY created_at DESC LIMIT $${idx}`,
      [...params, parseInt(limit)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============ CSV EXPORT ============
const exportCsv = async (req, res) => {
  try {
    const { from, to } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (from) { conditions.push(`created_at >= $${idx++}`); params.push(from); }
    if (to) { conditions.push(`created_at <= $${idx++}`); params.push(to); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await query(
      `SELECT id, event_type, platform, status, response_time, country, error_type, created_at
       FROM analytics_events ${where} ORDER BY created_at DESC LIMIT 10000`,
      params
    );

    const headers = ['id', 'event_type', 'platform', 'status', 'response_time', 'country', 'error_type', 'created_at'];
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

// ============ PLATFORM HEALTH ============
const getPlatformHealth = async (req, res) => {
  try {
    const result = await query(`
      SELECT platform,
             COUNT(*) as total_24h,
             COUNT(*) FILTER (WHERE status = 'success') as success_24h,
             ROUND(AVG(response_time) FILTER (WHERE status = 'success')) as avg_time_24h,
             ROUND(COUNT(*) FILTER (WHERE status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100, 1) as success_rate
      FROM analytics_events
      WHERE created_at > NOW() - INTERVAL '24 hours'
      GROUP BY platform ORDER BY total_24h DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  adminLogin,
  authMiddleware,
  getDashboardStats,
  getChartData,
  getFailureBreakdown,
  getGeoAnalytics,
  getPerformanceMetrics,
  getRecentActivity,
  exportCsv,
  getPlatformHealth,
};
