# ClipVora

A full-stack media downloader that lets you save videos, images, and audio from popular social media platforms — with a built-in analytics admin dashboard.

## Supported Platforms

- **YouTube** - Videos, Shorts, MP3 audio
- **Instagram** - Reels, Stories, Posts, Carousels
- **Facebook** - Videos, Reels, Stories
- **X (Twitter)** - Videos, GIFs, Images
- **Pinterest** - Videos, Images, GIFs
- **LinkedIn** - Video posts, Native videos

## Features

- Video downloads in multiple qualities (up to 4K)
- Audio extraction (MP3)
- Image downloads with carousel/multi-image support
- "No Audio" badge on video-only formats
- Real-time download progress tracking (SSE)
- Python scraper fallbacks (instaloader, facebook-scraper, pinterest-dl)
- 18 language translations
- Chrome extension for one-click downloads
- Dark/Light mode

## Admin Dashboard

A protected analytics dashboard at `/admin` with JWT authentication.

- **Overview** - Total downloads, success rate, avg latency, downloads over time
- **Platform Distribution** - Pie chart of usage per platform
- **Peak Hours** - Bar chart of hourly activity
- **Failure Breakdown** - Error types, failure rate by platform, failure trends
- **Performance** - Response time per platform, slowest requests
- **Geography** - Downloads by country (IP-based geolocation)
- **Platform Health** - success rate per platform with status indicators
- **Activity Log** - Filterable, searchable live event stream
- **CSV Export** - Download all analytics data
- Auto-refresh every 30 seconds

## Tech Stack

- **Frontend**: React, Vite, Framer Motion, Axios
- **Backend**: Node.js, Express, PostgreSQL (Supabase)
- **Admin**: React, Recharts, JWT auth
- **Media Processing**: yt-dlp, ffmpeg
- **Scraper Fallbacks**: instaloader, facebook-scraper, pinterest-dl (Python)
- **Database**: PostgreSQL via Supabase
- **Extension**: Chrome Manifest V3

## Project Structure

```
ClipVora/
├── web/          # React frontend (user-facing)
├── admin/        # React admin dashboard
├── backend/      # Express API server + analytics
├── extension/    # Chrome extension
```

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+ with venv
- ffmpeg installed on your system

### Backend

```bash
cd backend
npm install
python3 -m venv venv
./venv/bin/pip install yt-dlp[default] instaloader facebook-scraper pinterest-dl lxml_html_clean
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

### Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

The admin panel runs on `http://localhost:5001`.

### Database Setup

Initialize the PostgreSQL analytics table:

```bash
cd backend
node init-db.js
```

### Environment Variables

Create `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword
JWT_SECRET=your_jwt_secret_key
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | Required |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |
| `JWT_SECRET` | JWT signing key | `clipvora_default_secret` |
| `YTDLP_PATH` | Path to yt-dlp binary | Auto-detected |
| `FFMPEG_PATH` | Path to ffmpeg binary | Auto-detected |
| `VITE_API_URL` | Backend API URL (frontend) | `http://localhost:4000` |

## Deployment (Render)

### Backend + Admin (Single Docker Service)

The Dockerfile at the project root builds both the admin panel and backend into one service. The admin dashboard is served at `/admin-panel`.

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `.` (root — leave empty)
4. Set **Runtime** to **Docker**
5. Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=your_supabase_connection_string`
   - `ADMIN_USERNAME=admin`
   - `ADMIN_PASSWORD=YourSecurePassword`
   - `JWT_SECRET=your_secret_key`

After deploy, the admin panel is at `https://your-app.onrender.com/admin-panel`.

### Frontend (Static Site)

1. Create a new **Static Site** on Render
2. Set **Root Directory** to `web`
3. Set **Build Command** to `npm install && npm run build`
4. Set **Publish Directory** to `dist`
5. Add env: `VITE_API_URL=https://your-backend.onrender.com`

## Chrome Extension

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked" and select the `extension/` folder

## API Endpoints

### Public
| Method | Path | Description |
|---|---|---|
| `POST` | `/info` | Fetch media metadata from URL |
| `POST` | `/download` | Start download job |
| `GET` | `/progress/:jobId` | SSE progress stream |
| `GET` | `/fetch/:jobId` | Download completed file |
| `GET` | `/download-image` | Proxy image download |
| `GET` | `/download-video` | Proxy video download |
| `GET` | `/proxy-thumb` | Thumbnail proxy |

### Admin (JWT protected)
| Method | Path | Description |
|---|---|---|
| `POST` | `/admin/login` | Get JWT token |
| `GET` | `/admin/stats` | Dashboard stats |
| `GET` | `/admin/charts` | Chart data |
| `GET` | `/admin/activity` | Recent events (filterable) |
| `GET` | `/admin/failures` | Failure breakdown |
| `GET` | `/admin/geo` | Geographic analytics |
| `GET` | `/admin/performance` | Performance metrics |
| `GET` | `/admin/health` | Platform health |
| `GET` | `/admin/export` | CSV export |

## License

ISC
