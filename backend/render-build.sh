#!/usr/bin/env bash
set -e

# Install Node dependencies
npm install

# Install yt-dlp nightly binary (nightly has the latest YouTube fixes)
curl -L https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp

# Install ffmpeg
apt-get update && apt-get install -y --no-install-recommends ffmpeg
apt-get clean && rm -rf /var/lib/apt/lists/*

echo "Build complete. yt-dlp: $(yt-dlp --version), ffmpeg: $(ffmpeg -version | head -1)"
