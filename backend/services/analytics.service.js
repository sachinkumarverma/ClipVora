const { query } = require('../db');

const parseDevice = (userAgent) => {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return 'bot';
  if (ua.includes('ipad') || ua.includes('tablet')) return 'tablet';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'mobile';
  return 'desktop';
};

const parseDeviceModel = (userAgent) => {
  if (!userAgent) return null;
  // Android: "Android 14; SM-S928B" or "Android 13; Pixel 7"
  const android = userAgent.match(/Android\s[\d.]+;\s*([^;)]+)/);
  if (android) return android[1].trim();
  // iPhone/iPad: "iPhone" or "iPad"
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  // Windows
  const win = userAgent.match(/(Windows NT [\d.]+)/);
  if (win) {
    const ver = { '10.0': 'Windows 10/11', '6.3': 'Windows 8.1', '6.2': 'Windows 8', '6.1': 'Windows 7' };
    const v = win[1].replace('Windows NT ', '');
    return ver[v] || 'Windows';
  }
  // Mac
  if (userAgent.includes('Macintosh')) return 'Mac';
  // Linux
  if (userAgent.includes('Linux')) return 'Linux';
  return null;
};

const parseBrowser = (userAgent) => {
  if (!userAgent) return null;
  if (userAgent.includes('Edg/')) return 'Edge';
  if (userAgent.includes('OPR/') || userAgent.includes('Opera')) return 'Opera';
  if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) return 'Chrome';
  if (userAgent.includes('Firefox/')) return 'Firefox';
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'Safari';
  return null;
};

const trackEvent = async ({ eventType, platform, status, responseTime, country, errorType, metadata, ip, userAgent }) => {
  const deviceType = parseDevice(userAgent);
  const deviceModel = parseDeviceModel(userAgent);
  const browser = parseBrowser(userAgent);
  const meta = { ...metadata, ...(ip ? { ip } : {}), ...(deviceModel ? { device: deviceModel } : {}), ...(browser ? { browser } : {}) };

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
