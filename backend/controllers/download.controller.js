const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { isSupported, getPlatformName } = require('../utils/platform');
const { getClientIp, getCountry } = require('../utils/ip');
const { mimeTypes } = require('../utils/media');
const { commonArgs, ytdlpPath } = require('../services/ytdlp.service');
const { createJob, getJob, deleteJob } = require('../services/job.service');
const { trackEvent } = require('../services/analytics.service');
const { tempDir, ffmpegPath } = require('../config');

const startDownload = async (req, res) => {
  const { url, format, formatId } = req.body;
  const startTime = Date.now();
  const platform = getPlatformName(url);
  const country = await getCountry(req);
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'];

  if (!url || !isSupported(url)) {
    return res.status(400).json({ error: 'Unsupported or invalid URL' });
  }

  const jobId = crypto.randomUUID();
  const outputTemplate = path.join(tempDir, `${jobId}.%(ext)s`);

  const args = [
    ...commonArgs,
    '--ignore-errors', '--newline', '--progress',
    '--ffmpeg-location', ffmpegPath,
    '-o', outputTemplate, url
  ];

  if (format === 'mp3') {
    args.unshift('-x', '--audio-format', 'mp3');
  } else if (format === 'image') {
    if (formatId && formatId !== 'original') args.unshift('-f', formatId);
  } else {
    args.unshift('-f', formatId || 'bestvideo+bestaudio/best');
  }

  const proc = spawn(ytdlpPath, args);
  const job = createJob(jobId);
  job.proc = proc;

  const parseProgress = (data) => {
    const match = data.toString().match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
    if (match) job.progress = parseFloat(match[1]);
  };

  proc.stdout.on('data', parseProgress);
  proc.stderr.on('data', parseProgress);

  proc.on('close', (code) => {
    const files = fs.readdirSync(tempDir).filter(f => f.startsWith(jobId));
    const responseTime = Date.now() - startTime;

    if (files.length > 0) {
      job.status = 'completed';
      job.progress = 100;
      job.fileName = files[0];
      trackEvent({ eventType: 'download', platform, status: 'success', responseTime, country, ip, userAgent, metadata: { format, jobId } });
    } else {
      job.status = 'failed';
      trackEvent({ eventType: 'download', platform, status: 'failure', responseTime, country, ip, userAgent, errorType: 'download_failed', metadata: { format, jobId, code } });
    }
  });

  res.json({ jobId });
};

const streamProgress = (req, res) => {
  const job = getJob(req.params.jobId);
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
};

const fetchFile = (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job || !job.fileName) return res.status(404).json({ error: 'File not found' });

  const filePath = path.join(tempDir, job.fileName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

  const stat = fs.statSync(filePath);
  const ext = path.extname(job.fileName).toLowerCase();

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `attachment; filename="${job.fileName}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on('end', () => {
    setTimeout(() => {
      try { fs.unlinkSync(filePath); } catch {}
      deleteJob(req.params.jobId);
    }, 60000);
  });
};

module.exports = { startDownload, streamProgress, fetchFile };
