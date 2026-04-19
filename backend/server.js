const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const http = require("http");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ytdlpPath = path.join(__dirname, "venv", "bin", "yt-dlp");
const ffmpegPath = "/home/sachin/.cache/Cypress/15.10.0/Cypress/resources/app/node_modules/@ffmpeg-installer/linux-x64/ffmpeg";
const tempDir = path.join(require("os").homedir(), "ClipVora", "downloads");

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const jobs = new Map();

const sanitizeTitle = (title) =>
  title.replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, " ").trim();

// Common yt-dlp args
// Find node binary path for yt-dlp JS challenge solving
const nodePath = process.execPath;

const commonArgs = [
  "--no-warnings",
  "--no-check-certificates",
  "--no-cache-dir",
  "--force-ipv4",
  "--cookies-from-browser", "chrome",
  "--socket-timeout", "30",
  "--js-runtimes", `node:${nodePath}`,
];

const isSupported = (url) => {
  const supportedDomains = [
    'youtube.com', 'youtu.be',
    'instagram.com',
    'facebook.com', 'fb.watch',
    'pinterest.com', 'pin.it',
    'threads.net', 'threads.com',
    'twitter.com', 'x.com', 't.co'
  ];
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    return supportedDomains.some(d => domain.includes(d));
  } catch {
    return false;
  }
};

// ============ HELPERS ============
const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

const isImageUrl = (u) => {
  if (!u) return false;
  const lower = u.split('?')[0].toLowerCase();
  return imageExts.some(ext => lower.endsWith(`.${ext}`));
};

const extractImagesFromEntry = (entry) => {
  const formats = entry.formats || [];
  const images = [];

  // 1. From formats array (image file extensions)
  formats.filter(f => imageExts.includes(f.ext)).forEach(f => {
    images.push({
      id: f.format_id, ext: f.ext,
      quality: f.format_note || f.resolution || (f.width && f.height ? `${f.width}x${f.height}` : 'Original'),
      filesize: f.filesize || f.filesize_approx,
      width: f.width, height: f.height, url: f.url
    });
  });

  // 2. Direct URL is an image
  if (images.length === 0 && entry.url && isImageUrl(entry.url)) {
    const ext = entry.url.split('?')[0].split('.').pop().toLowerCase();
    images.push({
      id: 'original', ext: imageExts.includes(ext) ? ext : 'jpg',
      quality: entry.width && entry.height ? `${entry.width}x${entry.height}` : 'Original',
      filesize: entry.filesize || entry.filesize_approx,
      width: entry.width, height: entry.height, url: entry.url
    });
  }

  // 3. No video codecs + has a URL → likely an image post
  const hasVideo = formats.some(f => f.vcodec && f.vcodec !== 'none' && !imageExts.includes(f.ext));
  if (images.length === 0 && !hasVideo && entry.url) {
    images.push({
      id: 'original', ext: entry.ext || 'jpg',
      quality: entry.width && entry.height ? `${entry.width}x${entry.height}` : 'Original',
      filesize: entry.filesize || entry.filesize_approx,
      width: entry.width, height: entry.height, url: entry.url
    });
  }

  // 4. Fallback: best thumbnail
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

const runYtdlp = (args) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(ytdlpPath, args);
    let output = "", stderrOutput = "";
    proc.stdout.on("data", (d) => (output += d.toString()));
    proc.stderr.on("data", (d) => (stderrOutput += d.toString()));
    proc.on("close", (code) => resolve({ output, stderrOutput, code }));
    proc.on("error", (err) => reject(err));
  });
};

// Platforms that support carousel/multi-image posts
const carouselPlatforms = ['instagram.com', 'threads.net', 'threads.com', 'twitter.com', 'x.com', 't.co', 'facebook.com', 'fb.watch'];

const isCarouselPlatform = (url) => {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    return carouselPlatforms.some(d => host.includes(d));
  } catch { return false; }
};

// ============ INFO ENDPOINT ============
app.post("/info", async (req, res) => {
  const { url } = req.body;
  if (!url || !isSupported(url)) {
    return res.status(400).json({ message: "Unsupported or invalid URL" });
  }

  try {
    // Fetch metadata (single entry)
    const single = await runYtdlp(["--dump-json", "--no-playlist", ...commonArgs, url]);

    if (!single.output.trim()) {
      console.error("yt-dlp info failed:", single.stderrOutput);
      let msg = "Failed to fetch metadata.";
      if (single.stderrOutput.includes("Sign in") || single.stderrOutput.includes("bot"))
        msg = "YouTube requires authentication. Please try again.";
      else if (single.stderrOutput.includes("login") || single.stderrOutput.includes("cookie"))
        msg = "This content requires login. Try a public post.";
      else if (single.stderrOutput.includes("Unsupported"))
        msg = "This URL format is not supported.";
      return res.status(500).json({ message: msg });
    }

    const metadata = JSON.parse(single.output);
    const formats = metadata.formats || [];

    // Extract video formats
    const videoFormats = formats
      .filter(f => f.vcodec && f.vcodec !== 'none' && !imageExts.includes(f.ext) &&
        (f.acodec !== 'none' || f.format_note?.includes('p') || f.resolution || f.height))
      .map(f => {
        const quality = f.format_note || f.resolution || (f.height ? `${f.height}p` : 'Video');
        let filesize = f.filesize || f.filesize_approx;
        if (!filesize && f.tbr && metadata.duration) filesize = Math.round((f.tbr * 1000 / 8) * metadata.duration);
        return { id: f.format_id, ext: f.ext, quality, filesize, width: f.width, height: f.height };
      })
      .filter((v, i, a) => a.findIndex(t => t.quality === v.quality) === i);

    // Extract audio formats
    const audioFormats = formats
      .filter(f => f.vcodec === 'none' && f.acodec && f.acodec !== 'none')
      .map(f => {
        let filesize = f.filesize || f.filesize_approx;
        if (!filesize && f.abr && metadata.duration) filesize = Math.round((f.abr * 1000 / 8) * metadata.duration);
        return { id: f.format_id, ext: f.ext, quality: f.abr ? `${Math.round(f.abr)}kbps` : 'Audio', filesize };
      })
      .filter((v, i, a) => a.findIndex(t => t.quality === v.quality) === i);

    // Extract images from single entry
    let imageFormats = extractImagesFromEntry(metadata);

    // For carousel/multi-image posts (Instagram, Threads, Twitter, Facebook only — NOT YouTube)
    const hasVideo = formats.some(f => f.vcodec && f.vcodec !== 'none' && !imageExts.includes(f.ext));
    if (isCarouselPlatform(url) && (!hasVideo || imageFormats.length > 0)) {
      try {
        const playlist = await runYtdlp(["--dump-json", ...commonArgs, url]);
        if (playlist.output.trim()) {
          const entries = playlist.output.trim().split('\n')
            .map(line => { try { return JSON.parse(line); } catch { return null; } })
            .filter(Boolean);

          // Multiple entries = carousel post
          if (entries.length > 1) {
            imageFormats = [];
            entries.forEach((entry, idx) => {
              const entryImages = extractImagesFromEntry(entry);
              entryImages.forEach(img => {
                img.id = `carousel_${idx}_${img.id}`;
                img.quality = `Image ${idx + 1}` + (img.width && img.height ? ` (${img.width}x${img.height})` : '');
                img.thumbnail = entry.thumbnail || (entry.thumbnails?.length > 0
                  ? [...entry.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0))[0].url
                  : null);
              });
              imageFormats.push(...entryImages);
            });
          }
        }
      } catch (e) {
        console.error("Carousel fetch failed:", e.message);
      }
    }

    // Deduplicate images by URL
    imageFormats = imageFormats.filter((v, i, a) => !v.url || a.findIndex(t => t.url === v.url) === i);

    const isImageOnly = !hasVideo && imageFormats.length > 0;
    let mediaType = 'video';
    if (isImageOnly) mediaType = 'image';
    else if (hasVideo && imageFormats.length > 0) mediaType = 'mixed';
    else if (videoFormats.length === 0 && audioFormats.length > 0) mediaType = 'audio';

    let extractor = (metadata.extractor || '').toLowerCase();
    if (extractor.includes('twitter') || extractor.includes('x')) extractor = 'twitter';
    if (extractor.includes('pinterest')) extractor = 'pinterest';
    if (extractor.includes('thread')) extractor = 'threads';

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
    console.error("Info error:", e.message);
    res.status(500).json({ message: "Error fetching metadata" });
  }
});

// ============ DOWNLOAD ENDPOINT ============
app.post("/download", async (req, res) => {
  const { url, format, formatId } = req.body;
  if (!url || !isSupported(url)) {
    return res.status(400).json({ error: "Unsupported or invalid URL" });
  }

  const jobId = crypto.randomUUID();
  const outputTemplate = path.join(tempDir, `${jobId}.%(ext)s`);

  const args = [
    ...commonArgs,
    "--ignore-errors",
    "--newline",
    "--progress",
    "--ffmpeg-location", ffmpegPath,
    "-o", outputTemplate,
    url
  ];

  if (format === "mp3") {
    args.unshift("-x", "--audio-format", "mp3");
  } else if (format === "image") {
    if (formatId && formatId !== 'original') args.unshift("-f", formatId);
  } else {
    args.unshift("-f", formatId || "bestvideo+bestaudio/best");
  }

  const proc = spawn(ytdlpPath, args);

  const job = { id: jobId, progress: 0, status: 'downloading', proc, fileName: null };
  jobs.set(jobId, job);

  const parseProgress = (data) => {
    const line = data.toString();
    const match = line.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
    if (match) job.progress = parseFloat(match[1]);
  };

  proc.stdout.on("data", parseProgress);
  proc.stderr.on("data", parseProgress);

  proc.on("close", () => {
    // Check if file exists regardless of exit code (secretstorage warning causes code=1)
    const files = fs.readdirSync(tempDir).filter(f => f.startsWith(jobId));
    if (files.length > 0) {
      job.status = 'completed';
      job.progress = 100;
      job.fileName = files[0];
    } else {
      job.status = 'failed';
    }
  });

  res.json({ jobId });
});

// ============ PROGRESS SSE ============
app.get("/progress/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const timer = setInterval(() => {
    res.write(`data: ${JSON.stringify({ progress: job.progress, status: job.status, fileName: job.fileName })}\n\n`);
    if (job.status === 'completed' || job.status === 'failed') {
      clearInterval(timer);
      res.end();
    }
  }, 800);

  req.on('close', () => clearInterval(timer));
});

// ============ FETCH FILE — direct browser download ============
app.get("/fetch/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job || !job.fileName) return res.status(404).json({ error: "File not found" });

  const filePath = path.join(tempDir, job.fileName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });

  const stat = fs.statSync(filePath);
  const ext = path.extname(job.fileName).toLowerCase();

  const mimeTypes = {
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.mkv': 'video/x-matroska',
    '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.webp': 'image/webp', '.gif': 'image/gif',
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `attachment; filename="${job.fileName}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on('end', () => {
    setTimeout(() => {
      try { fs.unlinkSync(filePath); } catch {}
      jobs.delete(req.params.jobId);
    }, 60000);
  });
});

// ============ IMAGE DIRECT DOWNLOAD ============
// Downloads image directly and pipes to browser — no yt-dlp needed
app.get("/download-image", async (req, res) => {
  const { url, filename } = req.query;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': parsedUrl.origin,
      }
    }, (imageRes) => {
      if (imageRes.statusCode >= 300 && imageRes.statusCode < 400 && imageRes.headers.location) {
        // Follow redirect
        const redirectClient = imageRes.headers.location.startsWith('https') ? https : http;
        redirectClient.get(imageRes.headers.location, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, (redirectRes) => {
          const ct = redirectRes.headers['content-type'] || 'image/jpeg';
          const ext = ct.includes('png') ? '.png' : ct.includes('webp') ? '.webp' : ct.includes('gif') ? '.gif' : '.jpg';
          const fname = filename ? `${sanitizeTitle(filename)}${ext}` : `image${ext}`;
          res.setHeader('Content-Type', ct);
          res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
          if (redirectRes.headers['content-length']) res.setHeader('Content-Length', redirectRes.headers['content-length']);
          redirectRes.pipe(res);
        }).on('error', () => res.status(500).end());
        return;
      }

      const ct = imageRes.headers['content-type'] || 'image/jpeg';
      const ext = ct.includes('png') ? '.png' : ct.includes('webp') ? '.webp' : ct.includes('gif') ? '.gif' : '.jpg';
      const fname = filename ? `${sanitizeTitle(filename)}${ext}` : `image${ext}`;
      res.setHeader('Content-Type', ct);
      res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
      if (imageRes.headers['content-length']) res.setHeader('Content-Length', imageRes.headers['content-length']);
      imageRes.pipe(res);
    }).on('error', () => res.status(500).end());
  } catch {
    res.status(500).json({ error: "Failed to download image" });
  }
});

// ============ THUMBNAIL PROXY ============
app.get("/proxy-thumb", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).end();

  try {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': parsedUrl.origin,
      }
    }, (imageRes) => {
      if (imageRes.statusCode >= 300 && imageRes.statusCode < 400 && imageRes.headers.location) {
        const redirectClient = imageRes.headers.location.startsWith('https') ? https : http;
        redirectClient.get(imageRes.headers.location, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (rRes) => {
          res.setHeader('Content-Type', rRes.headers['content-type'] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          rRes.pipe(res);
        }).on('error', () => res.status(500).end());
        return;
      }
      res.setHeader('Content-Type', imageRes.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      imageRes.pipe(res);
    }).on('error', () => res.status(500).end());
  } catch {
    res.status(500).end();
  }
});

app.get("/", (req, res) => res.send("ClipVora API is active"));

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
