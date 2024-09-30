// models/chatModel.js
const db = require('../config/db'); // Your database connection

// Function to create a new chat session
const createSession = async (userId, consultantId) => {
    const [result] = await db.query(
        'INSERT INTO consulting_sessions (user_id, consultant_id, start_time, status) VALUES (?, ?, NOW(), ?)',
        [userId, consultantId, 'online'] // Initial status is 'online'
    );
    return result.insertId; // Return the session ID
};

// Function to update the session status
const updateSessionStatus = async (sessionId, status) => {
    await db.query(
        'UPDATE consulting_sessions SET status = ? WHERE session_id = ?',
        [status, sessionId]
    );
};

// Function to get session details
const getSession = async (sessionId) => {
    const [session] = await db.query('SELECT * FROM consulting_sessions WHERE session_id = ?', [sessionId]);
    return session;
};

// Function to check if a consultant is available
const isConsultantAvailable = async (consultantId) => {
    const [consultant] = await db.query('SELECT online_status FROM consultants WHERE consultant_id = ?', [consultantId]);
    return consultant && consultant.online_status === 'online';
};

// Export the functions
module.exports = {
    createSession,
    updateSessionStatus,
    getSession,
    isConsultantAvailable
};
