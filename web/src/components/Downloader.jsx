import { useState, useEffect, useRef } from 'react';
import {
  Download, AlertCircle, CheckCircle2,
  Loader2, Music, Video, Clock,
  Search, X, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useI18n } from '../i18n';

const API = 'http://localhost:4000';

export default function Downloader({ placeholder }) {
  const { t } = useI18n();
  const [url, setUrl] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Track which format is currently being prepared
  const [preparingId, setPreparingId] = useState(null);

  const handleFetchInfo = async (e) => {
    if (e) e.preventDefault();
    if (!url) return;
    setLoadingInfo(true); setError(''); setMetadata(null); setSuccess('');
    try {
      const response = await axios.post(`${API}/info`, { url });
      setMetadata(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t('unsupported'));
    } finally { setLoadingInfo(false); }
  };

  // Start download → wait for yt-dlp to finish → trigger browser download
  const startDownload = async (format, qualityId) => {
    setPreparingId(qualityId);
    setError('');
    try {
      const response = await axios.post(`${API}/download`, {
        url: metadata.original_url, format, formatId: qualityId
      });
      const jobId = response.data.jobId;

      // Poll progress via SSE, once completed trigger browser download
      const eventSource = new EventSource(`${API}/progress/${jobId}`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'completed') {
          eventSource.close();
          // Trigger browser's native download manager
          triggerBrowserDownload(`${API}/fetch/${jobId}`);
          setPreparingId(null);
          setSuccess(t('downloadComplete'));
        } else if (data.status === 'failed') {
          eventSource.close();
          setPreparingId(null);
          setError(t('extractionFailed'));
        }
      };
    } catch {
      setPreparingId(null);
      setError(t('couldNotStart'));
    }
  };

  // Download image directly via browser (no yt-dlp needed)
  const downloadImage = (imageUrl, title) => {
    const downloadUrl = `${API}/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(title || 'image')}`;
    triggerBrowserDownload(downloadUrl);
    setSuccess(t('downloadComplete'));
  };

  // Trigger native browser download via hidden <a> tag
  const triggerBrowserDownload = (fileUrl) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="search-wrapper">
        <form onSubmit={handleFetchInfo} className="search-bar">
          {url && (
            <button type="button" onClick={() => { setUrl(''); setMetadata(null); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 16px', color: '#94a3b8', display: 'flex' }}>
              <X size={18} />
            </button>
          )}
          <input type="text" placeholder={placeholder || t('searchPlaceholder')} value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit" disabled={loadingInfo} className="btn-primary">
            {loadingInfo ? <Loader2 size={18} className="animate-spin" /> : <><Download size={18} /> {t('download')}</>}
          </button>
        </form>
      </div>

      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ paddingTop: 32 }}>
              <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: 32 }}>
              <div className="alert alert-success"><CheckCircle2 size={18} /> {success}</div>
            </motion.div>
          )}

          {metadata && (
            <motion.div key="metadata" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="container result-section">
              <div className="result-layout">
                <div>
                  <div className="preview-card">
                    <div className="preview-media">
                      {metadata.extractor === 'youtube' ? (
                        <iframe src={`https://www.youtube.com/embed/${metadata.video_id}`} frameBorder="0" allowFullScreen />
                      ) : metadata.thumbnail ? (
                        <img
                          src={`${API}/proxy-thumb?url=${encodeURIComponent(metadata.thumbnail)}`}
                          alt="Preview"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: '0.9rem' }}>No preview</div>
                      )}
                    </div>
                    <div className="preview-info">
                      <div className="preview-title">{metadata.title}</div>
                      <div className="preview-tags">
                        {metadata.duration > 0 && <span className="tag tag-green"><Clock size={12} /> {formatTime(metadata.duration)}</span>}
                        <span className="tag tag-slate">{metadata.extractor}</span>
                        {metadata.mediaType === 'image' && <span className="tag tag-purple"><Image size={12} /> Image</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setMetadata(null); setSuccess(''); setError(''); }} className="btn-secondary">
                    <Search size={16} /> {t('fetchAnother')}
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Video Formats */}
                  {metadata.video?.length > 0 && (
                    <div className="format-list">
                      <div className="format-header">
                        <div className="format-header-icon" style={{ background: 'rgba(234,88,12,0.15)', color: '#ea580c' }}><Video size={16} /></div>
                        {t('videoFormats')}
                      </div>
                      {metadata.video.map((f) => (
                        <div key={f.id} className="format-row">
                          <div className="format-info">
                            <span className="badge badge-video">{f.ext?.toUpperCase()}</span>
                            <div>
                              <div className="format-quality">{f.quality}</div>
                              <div className="format-size">{formatSize(f.filesize) || t('estSizeNA')}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => startDownload('mp4', f.id)}
                            disabled={preparingId === f.id}
                            className="btn-download"
                          >
                            {preparingId === f.id ? <><Loader2 size={15} className="animate-spin" /> Preparing...</> : <><Download size={15} /> {t('download')}</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Image Formats */}
                  {metadata.images?.length > 0 && (
                    <div className="format-list">
                      <div className="format-header">
                        <div className="format-header-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}><Image size={16} /></div>
                        {t('imageDownloads')}
                      </div>
                      {metadata.images.map((f, i) => (
                        <div key={f.id || i} className="format-row">
                          <div className="format-info">
                            <span className="badge badge-image">{f.ext?.toUpperCase()}</span>
                            <div>
                              <div className="format-quality">{f.quality}</div>
                              <div className="format-size">{formatSize(f.filesize) || t('originalQuality')}</div>
                            </div>
                          </div>
                          {f.url ? (
                            <button onClick={() => downloadImage(f.url, metadata.title)} className="btn-download btn-download-image">
                              <Download size={15} /> {t('save')}
                            </button>
                          ) : (
                            <button
                              onClick={() => startDownload('image', f.id)}
                              disabled={preparingId === f.id}
                              className="btn-download btn-download-image"
                            >
                              {preparingId === f.id ? <><Loader2 size={15} className="animate-spin" /> Preparing...</> : <><Download size={15} /> {t('save')}</>}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Audio Formats */}
                  {metadata.audio?.length > 0 && (
                    <div className="format-list">
                      <div className="format-header">
                        <div className="format-header-icon" style={{ background: 'rgba(5,150,105,0.15)', color: '#059669' }}><Music size={16} /></div>
                        {t('audioMp3')}
                      </div>
                      {metadata.audio.map((f) => (
                        <div key={f.id} className="format-row">
                          <div className="format-info">
                            <span className="badge badge-audio">{f.ext?.toUpperCase()}</span>
                            <div>
                              <div className="format-quality">{f.quality}</div>
                              <div className="format-size">{formatSize(f.filesize) || t('estSizeNA')}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => startDownload('mp3', f.id)}
                            disabled={preparingId === f.id}
                            className="btn-download btn-download-audio"
                          >
                            {preparingId === f.id ? <><Loader2 size={15} className="animate-spin" /> Preparing...</> : <><Music size={15} /> {t('download')}</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
