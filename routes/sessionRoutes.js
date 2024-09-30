const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Middleware to log route access
const logRouteAccess = (req, res, next) => {
    console.log(`Route accessed: ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
};

// Apply middleware to session routes
router.use(logRouteAccess);

// Session routes
router.post('/create', sessionController.createSession);
router.get('/online', sessionController.getOnlineSessions);
router.put('/update-status', sessionController.updateSessionStatus);
// Get sessions created by a specific consultant
router.get('/consultant/:consultantId', sessionController.getSessionsByConsultant);

module.exports = router;
