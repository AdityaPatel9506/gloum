const db = require('../config/db');

// Create a new consultant
const createConsultant = async (
    username, 
    email,          // Email is required
    password,       // Password is required
    onlineStatus,   // Online status is required
    points,         // Points are required
    intro           // Intro is required
) => {
    const [result] = await db.query(
        'INSERT INTO consultants (username, email, password, online_status, points, intro) VALUES (?, ?, ?, ?, ?, ?)', 
        [username, email, password, onlineStatus, points, intro] // Pass all required values
    );
    return result.insertId; // Return the newly created consultant ID
};

// Update an existing consultant's status and points
const updateConsultant = async (consultantId, onlineStatus, points) => {
    const [result] = await db.query(
        'UPDATE consultants SET online_status = ?, points = ? WHERE consultant_id = ?',
        [onlineStatus, points, consultantId]
    );
    return result.affectedRows; // Return number of rows affected
};

// Get all consultants
const getAllConsultants = async () => {
    const [rows] = await db.query('SELECT * FROM consultants');
    return rows; // Return all consultants
};

// Get a consultant by ID
const getConsultantById = async (consultantId) => {
    const [rows] = await db.query('SELECT * FROM consultants WHERE consultant_id = ?', [consultantId]);
    return rows[0]; // Return the consultant found
};

// Get a consultant by email
const getConsultantByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM consultants WHERE email = ?', [email]);
    return rows[0]; // Return the consultant found
};

// Delete a consultant
const deleteConsultant = async (consultantId) => {
    const [result] = await db.query('DELETE FROM consultants WHERE consultant_id = ?', [consultantId]);
    return result.affectedRows; // Return number of rows affected
};

module.exports = {
    createConsultant,
    updateConsultant,
    getAllConsultants,
    getConsultantById,
    getConsultantByEmail, // Export the new method
    deleteConsultant,
};
