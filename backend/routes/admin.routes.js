const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const admin = require('../controllers/admin.controller');

router.post('/login', admin.login);
router.get('/stats', authMiddleware, admin.getStats);
router.get('/charts', authMiddleware, admin.getCharts);
router.get('/activity', authMiddleware, admin.getActivity);
router.get('/failures', authMiddleware, admin.getFailures);
router.get('/geo', authMiddleware, admin.getGeo);
router.get('/performance', authMiddleware, admin.getPerformance);
router.get('/health', authMiddleware, admin.getHealth);
router.get('/devices', authMiddleware, admin.getDevices);
router.get('/export', authMiddleware, admin.exportCsv);

module.exports = router;
