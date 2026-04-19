const { proxyRequest } = require('../utils/proxy');
const { sanitizeTitle } = require('../utils/sanitize');

const downloadVideo = async (req, res) => {
  const { url, filename } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const fname = filename ? `${sanitizeTitle(filename)}.mp4` : 'video.mp4';
    proxyRequest(url, res, { filename: fname, defaultType: 'video/mp4', attachment: true });
  } catch {
    res.status(500).json({ error: 'Failed to download video' });
  }
};

const downloadImage = async (req, res) => {
  const { url, filename } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const parsedUrl = new URL(url);
    // Determine extension from content type (handled in proxy headers)
    const fname = filename ? `${sanitizeTitle(filename)}.jpg` : 'image.jpg';
    proxyRequest(url, res, { filename: fname, defaultType: 'image/jpeg', attachment: true });
  } catch {
    res.status(500).json({ error: 'Failed to download image' });
  }
};

const proxyThumbnail = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).end();

  try {
    proxyRequest(url, res, { defaultType: 'image/jpeg', attachment: false, cacheControl: 'public, max-age=86400' });
  } catch {
    res.status(500).end();
  }
};

module.exports = { downloadVideo, downloadImage, proxyThumbnail };
