const io = require('socket.io-client');

// Connect to your Socket.IO server
const socket = io('http://localhost:5000');

// User ID
const userId = '1'; // Replace with actual user ID

// Listen for new messages and session updates
socket.on('sessionStarted', ({ sessionId }) => {
    console.log(`User: Chat session started with session ID: ${sessionId}`);
});

socket.on('newMessage', (msg) => {
    console.log(`User received message:`, msg);
});

socket.on('sessionClosed', ({ sessionId }) => {
    console.log(`User: Session ${sessionId} has been closed.`);
});

// Function to start a chat session with a consultant
function startChatSession(consultantId) {
    socket.emit('startChatSession', { userId, consultantId });
    console.log(`User: Requested chat session with consultant: ${consultantId}`);
}

// Function to send a chat message
function sendMessage(sessionId, message) {
    const senderId = userId;
    socket.emit('chatMessage', { sessionId, message, senderId });
    console.log(`User sent: ${message}`);
}

// Example prompt to start a chat and send messages
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question('User: Enter the consultant ID to start a session with: ', (consultantId) => {
    startChatSession(consultantId);

    readline.on('line', (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('User exiting...');
            process.exit();
        } else {
            readline.question('Enter session ID to send message to: ', (sessionId) => {
                sendMessage(sessionId, input); // Send chat message
            });
        }
    });
});
