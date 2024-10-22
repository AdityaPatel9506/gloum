const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    
    try {
        // Check if the user is already registered
        const existingUser = await authModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered with this email' });
        }

        // Register the user
        const result = await authModel.registerUser(name, email, password);
        res.status(201).json({ id: result.id, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use the loginUser method from the model to handle login
        const { token } = await authModel.loginUser(email, password);

        // Set the token in an HTTP-only cookie with security options
        res.cookie('gloum_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        // Respond with a message and token (if you want to return the token in the response body as well)
        res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        console.error('Error during login:', error); // Log the error for debugging

        // Handle specific error messages
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not registered' });
        } else if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        // Handle any other errors
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

const logout = (req, res) => {
    res.clearCookie('gloum_token');
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    logout,
};
