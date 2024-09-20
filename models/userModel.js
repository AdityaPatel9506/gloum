const db = require('../config/db'); // Adjust the path to your database configuration
const bcrypt = require('bcryptjs');

// Get user profile by ID
const getUserById = async (userId) => {
    try {
        // Query to select user details by ID
        const [user] = await db.query('SELECT id, email, name FROM users WHERE id = ?', [userId]);

        if (user.length === 0) {
            throw new Error('User not found');
        }

        return user[0]; // Return the user's details
    } catch (error) {
        throw error;
    }
};

// Update user profile by ID
const updateUserById = async (userId, updates) => {
    try {
        // Check if the user exists before attempting to update
        const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);

        if (existingUser.length === 0) {
            return { error: 'User not found' };
        }

        // Construct the update query
        let query = 'UPDATE users SET ';
        const values = [];

        // Add email to the update query if provided
        if (updates.email) {
            query += 'email = ?, ';
            values.push(updates.email);
        }

        // Add name to the update query if provided
        if (updates.name) {
            query += 'name = ?, ';
            values.push(updates.name);
        }

        // Add hashed password to the update query if provided
        if (updates.password) {
            const hashedPassword = await bcrypt.hash(updates.password, 10);
            query += 'password = ?, ';
            values.push(hashedPassword);
        }

        // Remove the trailing comma and space
        query = query.slice(0, -2);
        query += ' WHERE id = ?';
        values.push(userId);

        // Execute the update query
        const [result] = await db.query(query, values);

        // Check if any rows were actually updated
        if (result.affectedRows === 0) {
            return { error: 'Update failed: No changes were made' };
        }

        return { message: 'User updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Delete user profile by ID
const deleteUserById = async (userId) => {
    try {
        // Check if the user exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (existingUser.length === 0) {
            throw new Error('User not found');
        }

        // Delete the user from the database
        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        return { message: 'User deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById
};
