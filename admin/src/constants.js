export const API = window.location.hostname === 'localhost' ? 'http://localhost:4000' : window.location.origin;

export const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const PLATFORM_COLORS = {
  youtube: '#ff0000', instagram: '#e4405f', facebook: '#1877f2',
  twitter: '#000', pinterest: '#bd081c', linkedin: '#0a66c2'
};

export const DEVICE_COLORS = {
  desktop: '#6366f1', mobile: '#10b981', tablet: '#f59e0b',
  bot: '#ef4444', unknown: '#64748b'
};

export const PLATFORMS = ['youtube', 'instagram', 'facebook', 'twitter', 'pinterest', 'linkedin'];
