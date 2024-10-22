const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const secretKey = process.env.JWT_SECRET;

// Find user by email
const findUserByEmail = async (email) => {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        throw error;
    }
};
// find user by id

const findUserById = async (userId) => {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        throw error;
    }
};
const findConsultantById = async (consultantId) => {
    const [consultant] = await db.query("SELECT * FROM consultants WHERE consultant_id = ?", [consultantId]);
    return consultant[0]; // Return the consultant object
};

const updateUserCredits = async (userId, newCredits) => {
    try {
        const [result] = await db.query("UPDATE users SET credits = ? WHERE user_id = ?", [newCredits, userId]);
        return result.affectedRows > 0; // Return true if the update was successful
    } catch (error) {
        console.error('Error updating user credits:', error);
        throw new Error('Failed to update user credits');
    }
};
// Register a new user
const registerUser = async (name, email, password) => {
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        return { id: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Verify user password
const verifyPassword = async (user, password) => {
    try {
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        throw error;
    }
};

// Login a user and generate a JWT token
const loginUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
       
        

        const isMatch = await verifyPassword(user, password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.user_id, email: user.email, user_name:user.username,userType: 'user', credits:user.credits }, // Include userType if needed
            secretKey,
            { expiresIn: '10h' }
        );

        return { token };
    } catch (error) {
        throw error;
    }
};

const updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = {
    findUserByEmail,
    registerUser,
    verifyPassword,
    loginUser,
    verifyToken,
    findUserById,
    updateUserCredits,
    findConsultantById,
    updatePassword
};
