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
        // Check if the user exists first
        const user = await authModel.findUserByEmail(email);
        
        if (!user) {
            // If the user is not registered
            return res.status(404).json({ error: 'User not registered' });
        }

        // Log the password entered by the user
        console.log('Entered Password:', password);

        // Assuming the user's password is hashed, you would typically compare it directly
        const isValidPassword = await authModel.verifyPassword(user, password);

        if (!isValidPassword) {
            // If the password is incorrect
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        // Assuming you have access to the hashed password for logging purposes
        console.log('Stored Hashed Password:', user.password); // user.password should be the hashed password

        // Generate the token
        const token = jwt.sign({ email: user.email, userType: 'user' }, secretKey, { expiresIn: '10h' });

        // Set the token in an HTTP-only cookie with security options
        res.cookie('gloum_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        // Respond with a message and token
        res.status(200).json({ message: 'Login successful', token });
      
    } catch (error) {
        console.error('Error during login:', error); // Log the error for debugging
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
