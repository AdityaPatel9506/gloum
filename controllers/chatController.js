const db = require('../config/db'); // Ensure to import your database connection
const chatModel = require('../models/chatModel');
const io = require('../config/socket'); // Import the Socket.io instance

// Send a message to a specific session
const sendMessage = async (req, res) => {
    const { session_id, sender_id, message } = req.body;

    if (!session_id || !sender_id || !message) {
        return res.status(400).json({ message: 'session_id, sender_id, and message are required.' });
    }

    try {
        // Create a new chat message in the database
        const messageId = await chatModel.createChatMessage(session_id, sender_id, message);
        
        // Emit the message to the corresponding Socket.io room
        io.to(`session-${session_id}`).emit('newMessage', { message_id: messageId, session_id, sender_id, message });

        res.status(201).json({ message_id: messageId, session_id, sender_id, message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

// Get chat history for a specific session
const getChatHistory = async (req, res) => {
    const sessionId = req.params.session_id;

    try {
        const chatHistory = await chatModel.getChatHistory(sessionId);
        res.json(chatHistory);
    } catch (error) {
        console.error('Error retrieving chat history:', error);
        res.status(500).json({ message: 'Error retrieving chat history', error: error.message });
    }
};

// Start a new chat session
const startChatSession = async (req, res) => {
    const { consultantId } = req.body; // Only consultant ID is required from the request

    try {
        // Create a new session in the consulting_sessions table
        const result = await db.query(
            'INSERT INTO consulting_sessions (consultant_id, start_time, status) VALUES (?, NOW(), ?)',
            [consultantId, 'ongoing']
        );
        console.log(result);
        

        // Get the newly created session ID
        const sessionId = result.insertId;

        // Emit to socket that a new chat session has started
        io.emit('sessionStarted', { sessionId, consultantId });

        res.status(201).json({ sessionId });
    } catch (error) {
        console.error('Error starting chat session:', error);
        res.status(500).json({ error: 'Failed to start chat session' });
    }
};

// Update user ID when a user joins a session
const joinChatSession = async (req, res) => {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
        return res.status(400).json({ message: 'sessionId and userId are required.' });
    }

    try {
        // Update the session with the user ID and set the start time
        await db.query(
            'UPDATE consulting_sessions SET user_id = ?, start_time = NOW() WHERE session_id = ? AND status = ?',
            [userId, sessionId, 'ongoing']
        );

        // Join the Socket.io room
        const roomName = `session-${sessionId}`;
        io.to(roomName).emit('userJoined', { userId });

        res.status(200).json({ message: 'User joined successfully.', sessionId });
    } catch (error) {
        console.error('Error joining chat session:', error);
        res.status(500).json({ error: 'Failed to join chat session' });
    }
};

// Close a chat session
const closeChatSession = async (req, res) => {
    const { sessionId } = req.body; // Get the session ID from the request

    if (!sessionId) {
        return res.status(400).json({ message: 'sessionId is required.' });
    }

    try {
        // Update the session status to 'completed' in the consulting_sessions table
        await db.query(
            'UPDATE consulting_sessions SET end_time = NOW(), status = ? WHERE session_id = ?',
            ['completed', sessionId]
        );

        // Notify users in the Socket.io room about the session closure
        io.to(`session-${sessionId}`).emit('sessionClosed', { sessionId });

        res.status(200).json({ message: 'Chat session closed successfully.' });
    } catch (error) {
        console.error('Error closing chat session:', error);
        res.status(500).json({ error: 'Failed to close chat session' });
    }
};

// Get a specific session details
const getSession = async ({ params }) => {
    const sessionId = params.sessionId;

    // Assuming you're using a MySQL query to find the session
    const [session] = await db.query('SELECT * FROM consulting_sessions WHERE session_id = ?', [sessionId]);

    // Check if the session exists
    if (!session || session.length === 0) {
        console.error(`Session not found for ID: ${sessionId}`);
        throw new Error('Session not found');
    }

    return session[0]; // Return the first session object
};
// Exporting all functions
module.exports = {
    sendMessage,
    getChatHistory,
    startChatSession,
    joinChatSession,
    closeChatSession,
    getSession
};
