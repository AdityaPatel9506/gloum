const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware'); // Ensure you're importing correctly
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const transporter = require('../mailer');
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


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists in the database (replace with your user lookup logic)
        const user = await authController.findUserByEmail(email); // Ensure this function exists

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Generate a JWT token with the user's email (expires in 15 minutes)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const resetLink = `http://gloumastro.com/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`
        };

        // Send the password reset link via email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ error: 'Failed to send password reset email.' });
    }
});

// Route to verify token and reset password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the token
        const decoded = authModel.verifyToken(token);

        // Update the user's password in the database
        await authModel.updatePassword(decoded.email, newPassword);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
});

module.exports = router;
