const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Read user profile (authentication required)
router.get('/profile', authenticate, userController.getUserProfile);

// Update user profile (authentication required)
router.put('/update', authenticate, userController.updateUserProfile);

// Delete user profile (authentication required)
router.delete('/delete', authenticate, userController.deleteUserProfile);

module.exports = router;
