import youtubeLogo from './assets/youtube.png';
import instagramLogo from './assets/instagram.png';
import facebookLogo from './assets/facebook.png';
import pinterestLogo from './assets/pinterest.png';
import twitterLogo from './assets/twitter.png';
import linkedinLogo from './assets/linkedin.png';

const platforms = [
  {
    key: 'youtube',
    name: 'YouTube',
    path: '/youtube',
    logo: youtubeLogo,
    color: '#ff0000',
    bgLight: '#fee2e2',
    heroTitle: 'YouTube Video Downloader',
    heroDesc: 'Download YouTube videos, shorts, and music in HD, Full HD, or MP3 format — free and fast.',
    placeholder: 'Paste YouTube video URL here... (e.g. youtube.com/watch?v=...)',
    features: ['Videos in HD & 4K', 'YouTube Shorts', 'MP3 Audio extraction'],
  },
  {
    key: 'instagram',
    name: 'Instagram',
    path: '/instagram',
    logo: instagramLogo,
    color: '#e4405f',
    bgLight: '#fce7f3',
    heroTitle: 'Instagram Downloader',
    heroDesc: 'Save Instagram reels, stories, posts, and images instantly in high quality.',
    placeholder: 'Paste Instagram URL here... (e.g. instagram.com/reel/...)',
    features: ['Reels & Videos', 'Stories & Highlights', 'Photos & Carousel'],
  },
  {
    key: 'facebook',
    name: 'Facebook',
    path: '/facebook',
    logo: facebookLogo,
    color: '#1877f2',
    bgLight: '#dbeafe',
    heroTitle: 'Facebook Video Downloader',
    heroDesc: 'Download Facebook videos, reels, and stories in MP4 format — quick and easy.',
    placeholder: 'Paste Facebook video URL here... (e.g. facebook.com/watch/...)',
    features: ['Videos & Reels', 'Stories', 'Live recordings'],
  },
  {
    key: 'twitter',
    name: 'X (Twitter)',
    path: '/twitter',
    logo: twitterLogo,
    color: '#000000',
    bgLight: '#f1f5f9',
    heroTitle: 'X (Twitter) Downloader',
    heroDesc: 'Download videos, GIFs, and images from X (Twitter) posts with a single click.',
    placeholder: 'Paste X/Twitter URL here... (e.g. x.com/user/status/...)',
    features: ['Videos & GIFs', 'Images & Media', 'Thread media'],
  },
  {
    key: 'pinterest',
    name: 'Pinterest',
    path: '/pinterest',
    logo: pinterestLogo,
    color: '#bd081c',
    bgLight: '#fee2e2',
    heroTitle: 'Pinterest Downloader',
    heroDesc: 'Download Pinterest videos, images, and GIFs in original quality.',
    placeholder: 'Paste Pinterest URL here... (e.g. pinterest.com/pin/...)',
    features: ['Videos & Clips', 'High-res images', 'GIFs & Pins'],
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    path: '/linkedin',
    logo: linkedinLogo,
    color: '#0a66c2',
    bgLight: '#dbeafe',
    heroTitle: 'LinkedIn Video Downloader',
    heroDesc: 'Download LinkedIn videos and posts in high quality — fast and free.',
    placeholder: 'Paste LinkedIn video URL here... (e.g. linkedin.com/posts/...)',
    features: ['Video posts', 'Native videos', 'Event recordings'],
  },
];

export default platforms;
