const { spawn } = require('child_process');
const { ytdlpPath, nodePath, isProduction, cookiesFile, hasCookiesFile } = require('../config');

const commonArgs = [
  '--no-warnings',
  '--no-check-certificates',
  '--no-cache-dir',
  '--force-ipv4',
  '--socket-timeout', '30',
  '--geo-bypass',
  '--js-runtimes', `node:${nodePath}`,
  // Bypass YouTube blocks on datacenter IPs
  '--extractor-args', 'youtube:player_client=web,android',
  '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  ...(hasCookiesFile ? ['--cookies', cookiesFile] : []),
  ...(!isProduction && !hasCookiesFile ? ['--cookies-from-browser', 'chrome'] : []),
];

/** @param {string[]} args */
const runYtdlp = (args, timeout = 60000) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(ytdlpPath, args);
    let output = '', stderrOutput = '';
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      proc.kill('SIGKILL');
      reject(new Error('yt-dlp timed out'));
    }, timeout);

    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.stderr.on('data', (d) => (stderrOutput += d.toString()));
    proc.on('close', (code) => {
      clearTimeout(timer);
      if (!killed) resolve({ output, stderrOutput, code });
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      if (!killed) reject(err);
    });
  });
};

module.exports = { commonArgs, runYtdlp, ytdlpPath };
