const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Route to send a chat message
router.post('/send', chatController.sendMessage);

// Route to get chat history for a specific session
router.get('/history/:session_id', chatController.getChatHistory);

// Route to start a new chat session
router.post('/start', chatController.startChatSession);

// Route to close a chat session
router.post('/close', chatController.closeChatSession); // New route for closing chat session

module.exports = router;
