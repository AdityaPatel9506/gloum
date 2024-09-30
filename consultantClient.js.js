const io = require('socket.io-client');

// Connect to your Socket.IO server
const socket = io('http://localhost:5000');

// Consultant ID
const consultantId = '1'; // Replace with the actual consultant ID

// Variable to hold the current session ID
let currentSessionId = null;

// Listen for session start and new messages
socket.on('roomCreated', ({ sessionId }) => {
    currentSessionId = sessionId; // Store the session ID for later use
    console.log(`Consultant: Chat session created with session ID: ${currentSessionId}`);
    // Automatically join the room after creating it
    joinRoom(currentSessionId);
});

socket.on('newMessage', (msg) => {
    console.log(`Consultant received message:`, msg);
});

socket.on('sessionClosed', ({ sessionId }) => {
    console.log(`Consultant: Session ${sessionId} has been closed.`);
    currentSessionId = null; // Reset session ID when session is closed
});

// Function to set consultant status (online/offline/busy)
function setConsultantStatus(status) {
    socket.emit('setConsultantStatus', { consultantId, status });
    console.log(`Consultant status set to ${status}`);
}

// Function to send a chat message
function sendMessage(sessionId, message) {
    const senderId = consultantId;
    socket.emit('chatMessage', { sessionId, message, senderId });
    console.log(`Consultant sent: ${message}`);
}

// Join room for a session
function joinRoom(sessionId) {
    socket.emit('joinRoom', { sessionId });
    console.log(`Consultant joining session: ${sessionId}`);
}

// Create a new session (simulate session start)
function createSession(userId) {
    socket.emit('createRoom', { userId, consultantId });
}

// Sample usage
setConsultantStatus('online'); // Set status to 'online'

// Example prompt to send messages
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Start a new session
readline.question('Consultant: Type a user ID to start a session: ', (userId) => {
    createSession(userId); // Create a new session when prompted

    // Listen for input to send chat messages
    readline.on('line', (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('Consultant exiting...');
            process.exit();
        } else {
            // Use the currentSessionId to send the message
            if (currentSessionId) {
                sendMessage(currentSessionId, input); // Send chat message
            } else {
                console.log('No active session to send the message.');
            }
        }
    });
});
