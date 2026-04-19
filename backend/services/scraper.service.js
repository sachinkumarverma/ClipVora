const { spawn } = require('child_process');
const { pythonPath, scraperPath } = require('../config');

const runScraper = (platform, url) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(pythonPath, [scraperPath, platform, url], { timeout: 45000 });
    let output = '', stderrOutput = '';
    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.stderr.on('data', (d) => (stderrOutput += d.toString()));
    proc.on('close', () => {
      try {
        const data = JSON.parse(output.trim().split('\n').pop());
        if (data.error) reject(new Error(data.error));
        else resolve(data);
      } catch {
        reject(new Error(stderrOutput || 'Scraper returned invalid data'));
      }
    });
    proc.on('error', (err) => reject(err));
  });
};

const buildScraperResponse = (data, url) => {
  const videoFormats = (data.videos || []).map((v, i) => ({
    id: `scraper_video_${i}`, ext: v.ext || 'mp4', quality: v.quality || 'Original',
    filesize: null, width: v.width || null, height: v.height || null,
    hasAudio: true, directUrl: v.url
  }));
  const imageFormats = (data.images || []).map((img, i) => ({
    id: `scraper_img_${i}`, ext: img.ext || 'jpg',
    quality: (data.images.length > 1 ? `Image ${i + 1}` : 'Original') +
      (img.width && img.height ? ` (${img.width}x${img.height})` : ''),
    filesize: null, width: img.width || null, height: img.height || null,
    url: img.url
  }));
  return {
    title: data.title || 'Post',
    thumbnail: data.thumbnail, duration: null,
    extractor: data.extractor || 'unknown',
    webpage_url: url, video_id: null,
    video: videoFormats, audio: [],
    images: imageFormats,
    mediaType: videoFormats.length > 0 ? (imageFormats.length > 0 ? 'mixed' : 'video') : 'image',
    original_url: url
  };
};

module.exports = { runScraper, buildScraperResponse };
