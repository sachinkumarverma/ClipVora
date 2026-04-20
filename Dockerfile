FROM node:20-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg python3 python3-pip && \
    pip3 install --break-system-packages \
      "yt-dlp[default] @ https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download/yt-dlp.tar.gz" \
      instaloader facebook-scraper pinterest-dl lxml_html_clean && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Build admin panel
COPY admin/package*.json admin/
RUN cd admin && npm install
COPY admin/ admin/
RUN cd admin && npm run build

# Install backend
COPY backend/package*.json backend/
RUN cd backend && npm install --omit=dev
COPY backend/ backend/

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "backend/server.js"]
