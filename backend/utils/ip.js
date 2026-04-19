const http = require('http');

const geoCache = new Map();

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress?.replace('::ffff:', '') ||
    req.ip?.replace('::ffff:', '') || null;
};

const getCountry = async (req) => {
  const fromHeader = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'];
  if (fromHeader) return fromHeader;

  const ip = getClientIp(req);
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'LOCAL';
  }

  if (geoCache.has(ip)) return geoCache.get(ip);

  try {
    const response = await new Promise((resolve) => {
      http.get(`http://ip-api.com/json/${ip}?fields=countryCode`, { timeout: 3000 }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
      }).on('error', () => resolve(null));
    });
    const country = response?.countryCode || null;
    if (country) geoCache.set(ip, country);
    if (geoCache.size > 5000) geoCache.clear();
    return country;
  } catch {
    return null;
  }
};

module.exports = { getClientIp, getCountry };
