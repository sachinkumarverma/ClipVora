require('dotenv').config();
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 4000;
const nodePath = process.execPath;

const ytdlpPath = process.env.YTDLP_PATH || (isProduction ? '/usr/local/bin/yt-dlp' : path.join(__dirname, '..', 'venv', 'bin', 'yt-dlp'));
const ffmpegPath = process.env.FFMPEG_PATH || (isProduction ? '/usr/bin/ffmpeg' : '/home/sachin/.cache/Cypress/15.10.0/Cypress/resources/app/node_modules/@ffmpeg-installer/linux-x64/ffmpeg');
const tempDir = path.join(require('os').tmpdir(), 'clipvora_downloads');
const cookiesFile = path.join(__dirname, '..', 'cookies.txt');
const hasCookiesFile = fs.existsSync(cookiesFile);
const pythonPath = isProduction ? 'python3' : path.join(__dirname, '..', 'venv', 'bin', 'python3');
const scraperPath = path.join(__dirname, '..', 'scraper.py');
const adminBuildPath = path.join(__dirname, '..', '..', 'admin', 'dist');

const jwtSecret = process.env.JWT_SECRET || 'clipvora_default_secret';
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

// Ensure temp dir exists
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

module.exports = {
  isProduction, port, nodePath,
  ytdlpPath, ffmpegPath, tempDir,
  cookiesFile, hasCookiesFile,
  pythonPath, scraperPath, adminBuildPath,
  jwtSecret, adminUsername, adminPassword,
};
