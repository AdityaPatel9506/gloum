const db = require('../config/db'); // Your database connection

// Create a new session (with only consultant_id initially)
const createSession = async (req, res) => {
    const { consultant_id } = req.body;
    console.log(req.body);
    

    // Validate if consultant_id is provided
    if (!consultant_id) {
        return res.status(400).json({ message: 'Consultant ID is required to create a session.' });
    }

    try {
        // Create a new session with the consultant ID, set status as 'ongoing'
        const [result] = await db.query(
            "INSERT INTO consulting_sessions (consultant_id, start_time, status) VALUES (?, NOW(), 'ongoing')",
            [consultant_id]
        );

        // Respond with the newly created session ID
        res.status(201).json({ message: 'Session created successfully.', session_id: result.insertId });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'An error occurred while creating the session', error: error.message });
    }
};

// Get all ongoing sessions
const getOnlineSessions = async (req, res) => {
    try {
        // Fetch sessions where status is 'ongoing'
        const [sessions] = await db.query("SELECT * FROM consulting_sessions WHERE status = 'online'");

        // Check if any ongoing sessions are found
        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: 'No ongoing sessions found.' });
        }

        
        // Respond with the ongoing sessions
        res.status(200).json({ sessions });
    } catch (error) {
        console.error('Error retrieving ongoing sessions:', error);
        res.status(500).json({ message: 'An error occurred while retrieving sessions', error: error.message });
    }
};

// Update session status (e.g., to 'engaged', 'completed', etc.)
const updateSessionStatus = async (req, res) => {
    const { sessionId, status } = req.body;

    // Validate required fields
    if (!sessionId || !status) {
        return res.status(400).json({ message: 'sessionId and status are required.' });
    }

    try {
        // Update the session's status using the session ID
        const [result] = await db.query(
            "UPDATE consulting_sessions SET status = ? WHERE session_id = ?",
            [status, sessionId] // Pass status and sessionId correctly
        );

        // Check if the session was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Session not found or no changes were made.' });
        }

        res.status(200).json({ message: 'Session status updated successfully.' });
    } catch (error) {
        console.error('Error updating session status:', error);
        res.status(500).json({ message: 'An error occurred while updating the session status', error: error.message });
    }
};
// Get sessions created by a specific consultant
const getSessionsByConsultant = async (req, res) => {
    const { consultantId } = req.params; // Extract consultantId from the request parameters
console.log(consultantId);

    try {
        // Fetch sessions for the given consultant ID
        const [sessions] = await db.query(
            "SELECT * FROM consulting_sessions WHERE consultant_id = ?",
            [consultantId]
        );

        // Check if any sessions were found
        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: 'No sessions found for this consultant.' });
        }

        // Respond with the sessions
        res.status(200).json({ sessions });
    } catch (error) {
        console.error('Error retrieving sessions:', error);
        res.status(500).json({ message: 'An error occurred while retrieving sessions', error: error.message });
    }
};

module.exports = {
    createSession,
    getOnlineSessions,
    updateSessionStatus,
    getSessionsByConsultant
};
