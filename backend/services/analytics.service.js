const { query } = require('../db');

const parseDevice = (userAgent) => {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return 'bot';
  if (ua.includes('ipad') || ua.includes('tablet')) return 'tablet';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'mobile';
  return 'desktop';
};

const trackEvent = async ({ eventType, platform, status, responseTime, country, errorType, metadata, ip, userAgent }) => {
  const deviceType = parseDevice(userAgent);
  const meta = { ...metadata, ...(ip ? { ip } : {}) };

  const sql = `
    INSERT INTO analytics_events (event_type, platform, status, response_time, country, error_type, metadata, user_agent, device_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  const values = [
    eventType, platform, status, responseTime, country, errorType,
    Object.keys(meta).length > 0 ? JSON.stringify(meta) : null,
    userAgent || null, deviceType
  ];

  try {
    await query(sql, values);
  } catch (err) {
    console.error('Failed to track event:', err.message);
  }
};

module.exports = { trackEvent, parseDevice };
