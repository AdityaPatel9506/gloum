const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Example protected route
router.get('/profile', authenticate, (req, res) => {
    // Assuming user profile details are fetched from database
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
