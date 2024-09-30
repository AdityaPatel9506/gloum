const db = require('../config/db');

// Create a new admin
const createAdmin = async (username, email, password) => {
    console.log( [username, email, password]);
    
    const [result] = await db.query(
        'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );
    return result.insertId; // Return the newly created admin ID
};

// Get an admin by ID
const getAdminById = async (adminId) => {
    const [rows] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [adminId]);
    return rows[0]; // Return the admin found
};

// Get an admin by email
const getAdminByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0]; // Return the admin found
};

// Update an admin
const updateAdmin = async (adminId, username, email, password) => {
    const [result] = await db.query(
        'UPDATE admins SET username = ?, email = ?, password = ? WHERE admin_id = ?',
        [username, email, password, adminId]
    );
    return result.affectedRows; // Return number of rows affected
};

// Delete an admin
const deleteAdmin = async (adminId) => {
    const [result] = await db.query('DELETE FROM admins WHERE admin_id = ?', [adminId]);
    return result.affectedRows; // Return number of rows affected
};

module.exports = {
    createAdmin,
    getAdminById,
    getAdminByEmail,
    updateAdmin,
    deleteAdmin,
};
