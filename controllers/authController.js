const authModel = require('../models/authModel');

const register = async (req, res) => {
    const { name, email, password } = req.body;
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
        // Check if the user exists first
        const user = await authModel.findUserByEmail(email);
        
        if (!user) {
            // If the user is not registered
            return res.status(404).json({ error: 'User not registered' });
        }

        // Attempt to login the user (validate password)
        const isValidPassword = await authModel.verifyPassword(user, password);

        if (!isValidPassword) {
            // If the password is incorrect
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        // Generate token upon successful login
        const token = await authModel.loginUser(email, password);

        // Set the token in an HTTP-only cookie with security options
        res.cookie('gloum_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({ message: 'Login successful', token });
      
    } catch (error) {
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
