const https = require('https');
const http = require('http');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const proxyRequest = (url, res, { filename, defaultType, attachment = true, cacheControl }) => {
  const parsedUrl = new URL(url);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  client.get(url, {
    headers: { 'User-Agent': UA, 'Referer': parsedUrl.origin }
  }, (upstream) => {
    // Follow one redirect
    if (upstream.statusCode >= 300 && upstream.statusCode < 400 && upstream.headers.location) {
      const rClient = upstream.headers.location.startsWith('https') ? https : http;
      rClient.get(upstream.headers.location, {
        headers: { 'User-Agent': UA }
      }, (rRes) => {
        setHeaders(rRes, res, { filename, defaultType, attachment, cacheControl });
        rRes.pipe(res);
      }).on('error', () => res.status(500).end());
      return;
    }
    setHeaders(upstream, res, { filename, defaultType, attachment, cacheControl });
    upstream.pipe(res);
  }).on('error', () => res.status(500).end());
};

const setHeaders = (upstream, res, { filename, defaultType, attachment, cacheControl }) => {
  const ct = upstream.headers['content-type'] || defaultType || 'application/octet-stream';
  res.setHeader('Content-Type', ct);
  if (upstream.headers['content-length']) res.setHeader('Content-Length', upstream.headers['content-length']);
  if (attachment && filename) res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  if (cacheControl) res.setHeader('Cache-Control', cacheControl);
};

module.exports = { proxyRequest };
