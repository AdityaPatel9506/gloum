const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate, authenticateUser } = require('../middlewares/authMiddleware');
// Middleware to log route access
const logRouteAccess = (req, res, next) => {
    console.log(`Route accessed: ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
};

//  middleware to session routes
router.use(logRouteAccess);

// Session routes
router.post('/create', sessionController.createSession);
router.get('/online', sessionController.getOnlineSessions);
router.get('/credits/:userId', sessionController.getUserCredits);
router.put('/update-status', sessionController.updateSessionStatus);
router.get('/consultant/:consultantId', sessionController.getSessionsByConsultant);
router.post('/join', authenticate, authenticateUser, sessionController.joinSession);

module.exports = router;
