const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

const mimeTypes = {
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mkv': 'video/x-matroska',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif',
};

const isImageUrl = (u) => {
  if (!u) return false;
  const lower = u.split('?')[0].toLowerCase();
  return imageExts.some(ext => lower.endsWith(`.${ext}`));
};

const extractImagesFromEntry = (entry) => {
  const formats = entry.formats || [];
  const images = [];

  formats.filter(f => imageExts.includes(f.ext)).forEach(f => {
    images.push({
      id: f.format_id, ext: f.ext,
      quality: f.format_note || f.resolution || (f.width && f.height ? `${f.width}x${f.height}` : 'Original'),
      filesize: f.filesize || f.filesize_approx,
      width: f.width, height: f.height, url: f.url
    });
  });

  if (images.length === 0 && entry.url && isImageUrl(entry.url)) {
    const ext = entry.url.split('?')[0].split('.').pop().toLowerCase();
    images.push({
      id: 'original', ext: imageExts.includes(ext) ? ext : 'jpg',
      quality: entry.width && entry.height ? `${entry.width}x${entry.height}` : 'Original',
      filesize: entry.filesize || entry.filesize_approx,
      width: entry.width, height: entry.height, url: entry.url
    });
  }

  const hasVideo = formats.some(f => f.vcodec && f.vcodec !== 'none' && !imageExts.includes(f.ext));
  if (images.length === 0 && !hasVideo && entry.url) {
    images.push({
      id: 'original', ext: entry.ext || 'jpg',
      quality: entry.width && entry.height ? `${entry.width}x${entry.height}` : 'Original',
      filesize: entry.filesize || entry.filesize_approx,
      width: entry.width, height: entry.height, url: entry.url
    });
  }

  if (images.length === 0 && !hasVideo && entry.thumbnails?.length > 0) {
    const best = [...entry.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0))[0];
    if (best.url) {
      images.push({
        id: 'thumb', ext: 'jpg',
        quality: best.width && best.height ? `${best.width}x${best.height}` : 'Original',
        filesize: null, width: best.width, height: best.height, url: best.url
      });
    }
  }

  return images;
};

module.exports = { imageExts, mimeTypes, isImageUrl, extractImagesFromEntry };
