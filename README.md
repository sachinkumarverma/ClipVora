# ClipVora

A full-stack media downloader that lets you save videos, images, and audio from popular social media platforms.

## Supported Platforms

- **YouTube** - Videos, Shorts, MP3 audio
- **Instagram** - Reels, Stories, Posts, Carousels
- **Facebook** - Videos, Reels, Stories
- **X (Twitter)** - Videos, GIFs, Images
- **Pinterest** - Videos, Images, GIFs
- **Threads** - Videos, Images, Media posts

## Features

- Video downloads in multiple qualities (up to 4K)
- Audio extraction (MP3)
- Image downloads with carousel/multi-image support
- Real-time download progress tracking
- 18 language translations
- Chrome extension for one-click downloads
- Dark/Light mode

## Tech Stack

- **Frontend**: React, Vite, Framer Motion, Axios
- **Backend**: Node.js, Express
- **Media Processing**: yt-dlp, ffmpeg
- **Extension**: Chrome Manifest V3

## Project Structure

```
ClipVora/
├── web/          # React frontend
├── backend/      # Express API server
└── extension/    # Chrome extension
```

## Local Development

### Prerequisites

- Node.js 18+
- Python 3 with yt-dlp (`pip install yt-dlp[default]`)
- ffmpeg installed on your system

### Backend

```bash
cd backend
npm install
npm run dev
```

The server runs on `http://localhost:4000`.

### Frontend

```bash
cd web
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `4000` |
| `NODE_ENV` | Environment (`production` / `development`) | - |
| `YTDLP_PATH` | Path to yt-dlp binary | Auto-detected |
| `FFMPEG_PATH` | Path to ffmpeg binary | Auto-detected |
| `VITE_API_URL` | Backend API URL (frontend) | `http://localhost:4000` |

## Deployment (Render)

The backend includes a Dockerfile for deploying to Render:

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Runtime** to **Docker**
5. Add env variable: `NODE_ENV=production`

## Chrome Extension

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked" and select the `extension/` folder

## License

ISC
