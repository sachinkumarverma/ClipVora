const router = require('express').Router();
const { getMediaInfo } = require('../controllers/info.controller');
const { startDownload, streamProgress, fetchFile } = require('../controllers/download.controller');
const { downloadVideo, downloadImage, proxyThumbnail } = require('../controllers/proxy.controller');

router.post('/info', getMediaInfo);
router.post('/download', startDownload);
router.get('/progress/:jobId', streamProgress);
router.get('/fetch/:jobId', fetchFile);
router.get('/download-video', downloadVideo);
router.get('/download-image', downloadImage);
router.get('/proxy-thumb', proxyThumbnail);

module.exports = router;
