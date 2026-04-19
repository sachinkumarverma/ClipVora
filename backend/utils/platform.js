const supportedDomains = [
  'youtube.com', 'youtu.be',
  'instagram.com',
  'facebook.com', 'fb.watch', 'fb.com',
  'pinterest.com', 'pin.it',
  'linkedin.com',
  'twitter.com', 'x.com', 't.co',
];

const carouselPlatforms = ['instagram.com', 'twitter.com', 'x.com', 't.co', 'facebook.com', 'fb.watch'];

const normalizeHost = (url) => {
  try {
    return new URL(url).hostname.replace(/^(www|m|mobile)\./i, '');
  } catch { return ''; }
};

const isSupported = (url) => {
  const domain = normalizeHost(url);
  return domain ? supportedDomains.some(d => domain.includes(d)) : false;
};

const getPlatformName = (url) => {
  const host = normalizeHost(url);
  if (!host) return 'unknown';
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) return 'facebook';
  if (host.includes('pinterest.com') || host.includes('pin.it')) return 'pinterest';
  if (host.includes('linkedin.com')) return 'linkedin';
  if (host.includes('twitter.com') || host.includes('x.com') || host.includes('t.co')) return 'twitter';
  return 'unknown';
};

const isCarouselPlatform = (url) => {
  const host = normalizeHost(url);
  return host ? carouselPlatforms.some(d => host.includes(d)) : false;
};

module.exports = { isSupported, getPlatformName, isCarouselPlatform };
