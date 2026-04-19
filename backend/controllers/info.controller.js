const { isSupported, getPlatformName, isCarouselPlatform } = require('../utils/platform');
const { getClientIp, getCountry } = require('../utils/ip');
const { imageExts, extractImagesFromEntry } = require('../utils/media');
const { runYtdlp, commonArgs } = require('../services/ytdlp.service');
const { runScraper, buildScraperResponse } = require('../services/scraper.service');
const { trackEvent } = require('../services/analytics.service');

const getMediaInfo = async (req, res) => {
  const { url } = req.body;
  const startTime = Date.now();
  const platform = getPlatformName(url);
  const country = await getCountry(req);
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'];

  if (!url || !isSupported(url)) {
    trackEvent({ eventType: 'info', platform, status: 'failure', responseTime: Date.now() - startTime, country, ip, userAgent, errorType: 'unsupported_url' });
    return res.status(400).json({ message: 'Unsupported or invalid URL' });
  }

  try {
    const single = await runYtdlp(['--dump-json', '--no-playlist', ...commonArgs, url]);

    if (!single.output.trim()) {
      console.error('yt-dlp info failed:', single.stderrOutput);

      // Fallback: Python scrapers
      if (platform !== 'unknown') {
        try {
          const scraperData = await runScraper(platform, url);
          if (scraperData && ((scraperData.videos || []).length > 0 || (scraperData.images || []).length > 0)) {
            console.log(`Fallback scraper (${platform}) succeeded`);
            trackEvent({ eventType: 'info', platform, status: 'success', responseTime: Date.now() - startTime, country, ip, userAgent, metadata: { method: 'scraper_fallback' } });
            return res.json(buildScraperResponse(scraperData, url));
          }
        } catch (e) {
          console.error(`Scraper fallback (${platform}) failed:`, e.message);
        }
      }

      let msg = 'Failed to fetch metadata.';
      let errorType = 'metadata_fetch_failed';
      if (single.stderrOutput.includes('Sign in') || single.stderrOutput.includes('bot')) {
        msg = 'YouTube requires authentication. Please try again.'; errorType = 'auth_required';
      } else if (single.stderrOutput.includes('login') || single.stderrOutput.includes('cookie')) {
        msg = 'This content requires login. Try a public post.'; errorType = 'login_required';
      } else if (single.stderrOutput.includes('Unsupported')) {
        msg = 'This URL format is not supported.'; errorType = 'unsupported_format';
      }

      trackEvent({ eventType: 'info', platform, status: 'failure', responseTime: Date.now() - startTime, country, ip, userAgent, errorType });
      return res.status(500).json({ message: msg });
    }

    const metadata = JSON.parse(single.output);
    trackEvent({ eventType: 'info', platform, status: 'success', responseTime: Date.now() - startTime, country, ip, userAgent });

    const formats = metadata.formats || [];

    // Video formats
    let videoFormats = formats
      .filter(f => f.vcodec && f.vcodec !== 'none' && !imageExts.includes(f.ext) &&
        (f.acodec !== 'none' || f.format_note?.includes('p') || f.resolution || f.height))
      .map(f => {
        const quality = f.format_note || f.resolution || (f.height ? `${f.height}p` : 'Video');
        let filesize = f.filesize || f.filesize_approx;
        if (!filesize && f.tbr && metadata.duration) filesize = Math.round((f.tbr * 1000 / 8) * metadata.duration);
        const hasAudio = !!(f.acodec && f.acodec !== 'none');
        return { id: f.format_id, ext: f.ext, quality, filesize, width: f.width, height: f.height, hasAudio };
      })
      .filter((v, i, a) => a.findIndex(t => t.quality === v.quality) === i);

    // If all video formats lack audio (DASH-only like Instagram), replace with a
    // single "Best Quality" merged option — yt-dlp will merge video+audio on download
    const hasAudioFormats = formats.some(f => f.vcodec === 'none' && f.acodec && f.acodec !== 'none');
    const allVideoMuted = videoFormats.length > 0 && videoFormats.every(f => !f.hasAudio);
    if (allVideoMuted && hasAudioFormats) {
      // Get the best video stream for size estimation
      const best = videoFormats.reduce((a, b) => ((b.width || 0) > (a.width || 0) ? b : a), videoFormats[0]);
      const bestAudio = formats.find(f => f.vcodec === 'none' && f.acodec && f.acodec !== 'none');
      const totalSize = (best.filesize || 0) + (bestAudio?.filesize || bestAudio?.filesize_approx || 0);
      videoFormats = [{
        id: 'bestvideo+bestaudio/best', ext: 'mp4',
        quality: best.height ? `${best.height}p` : 'Best Quality',
        filesize: totalSize || null,
        width: best.width, height: best.height, hasAudio: true
      }];
    }

    // Audio formats
    const audioFormats = formats
      .filter(f => f.vcodec === 'none' && f.acodec && f.acodec !== 'none')
      .map(f => {
        let filesize = f.filesize || f.filesize_approx;
        if (!filesize && f.abr && metadata.duration) filesize = Math.round((f.abr * 1000 / 8) * metadata.duration);
        return { id: f.format_id, ext: f.ext, quality: f.abr ? `${Math.round(f.abr)}kbps` : 'Audio', filesize };
      })
      .filter((v, i, a) => a.findIndex(t => t.quality === v.quality) === i);

    // Image formats
    let imageFormats = extractImagesFromEntry(metadata);

    // Carousel support
    const hasVideo = formats.some(f => f.vcodec && f.vcodec !== 'none' && !imageExts.includes(f.ext));
    if (isCarouselPlatform(url) && (!hasVideo || imageFormats.length > 0)) {
      try {
        const playlist = await runYtdlp(['--dump-json', ...commonArgs, url]);
        if (playlist.output.trim()) {
          const entries = playlist.output.trim().split('\n')
            .map(line => { try { return JSON.parse(line); } catch { return null; } })
            .filter(Boolean);

          if (entries.length > 1) {
            imageFormats = [];
            entries.forEach((entry, idx) => {
              const entryImages = extractImagesFromEntry(entry);
              entryImages.forEach(img => {
                img.id = `carousel_${idx}_${img.id}`;
                img.quality = `Image ${idx + 1}` + (img.width && img.height ? ` (${img.width}x${img.height})` : '');
                img.thumbnail = entry.thumbnail || (entry.thumbnails?.length > 0
                  ? [...entry.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0))[0].url : null);
              });
              imageFormats.push(...entryImages);
            });
          }
        }
      } catch (e) {
        console.error('Carousel fetch failed:', e.message);
      }
    }

    // Deduplicate
    imageFormats = imageFormats.filter((v, i, a) => !v.url || a.findIndex(t => t.url === v.url) === i);

    const isImageOnly = !hasVideo && imageFormats.length > 0;
    let mediaType = 'video';
    if (isImageOnly) mediaType = 'image';
    else if (hasVideo && imageFormats.length > 0) mediaType = 'mixed';
    else if (videoFormats.length === 0 && audioFormats.length > 0) mediaType = 'audio';

    let extractor = (metadata.extractor || '').toLowerCase();
    if (extractor.includes('twitter') || extractor.includes('x')) extractor = 'twitter';
    if (extractor.includes('pinterest')) extractor = 'pinterest';
    if (extractor.includes('linkedin')) extractor = 'linkedin';

    let thumbnail = metadata.thumbnail;
    if (!thumbnail && metadata.thumbnails?.length > 0) {
      thumbnail = [...metadata.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0))[0].url;
    }

    res.json({
      title: metadata.title || metadata.description || 'Untitled',
      thumbnail, duration: metadata.duration, extractor,
      webpage_url: metadata.webpage_url, video_id: metadata.id,
      video: videoFormats.slice(0, 8),
      audio: audioFormats.slice(0, 4),
      images: imageFormats.slice(0, 20),
      mediaType, original_url: url
    });
  } catch (e) {
    console.error('Info error:', e.message);
    res.status(500).json({ message: 'Error fetching metadata' });
  }
};

module.exports = { getMediaInfo };
