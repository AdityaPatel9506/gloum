const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware'); // Ensure you're importing correctly

const router = express.Router();

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Consultant registration
router.post('/consultant/register', authController.register); 

// Consultant login
router.post('/consultant/login', authController.login); 

// Logout (applies to both users and consultants)
router.post('/logout', authController.logout); 

// Example protected route
router.get('/profile', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
