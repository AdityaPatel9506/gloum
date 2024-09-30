const socketio = require('socket.io');
const ChatController = require('../controllers/chatController');

const initializeSocket = (server) => {
    // const io = socketio(server);
    const io = socketio(server, {
        cors: {
            origin: '*', // Allow all origins, change in production
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Create a new chat room
        socket.on('createRoom', async ({ consultantId }) => {
            try {
                const sessionId = await ChatController.startChatSession({ body: { consultantId } });
                socket.join(`session-${sessionId}`);
                console.log(`${socket.id} created and joined room for session: ${sessionId}`);

                // Notify all clients about the new room creation
                io.emit('roomCreated', { sessionId });
            } catch (error) {
                console.error('Error creating room:', error);
                socket.emit('error', { message: 'Could not create room.' });
            }
        });

        // User joins an existing chat room
        socket.on('joinRoom', async ({ sessionId }) => {
            console.log(`Attempting to join room with sessionId: ${sessionId}`);
            try {
                const session = await ChatController.getSession({ params: { sessionId } });
                console.log(`Retrieved session:`, session);
        
                if (session.status === 'ongoing') {
                    socket.join(`session-${sessionId}`);
                    console.log(`${socket.id} joined room: session-${sessionId}`);
                    io.to(`session-${sessionId}`).emit('userJoined', { userId: socket.id });
                } else {
                    socket.emit('error', { message: 'This session is not ongoing.' });
                }
            } catch (error) {
                console.error('Error joining room:', error.message);
                socket.emit('error', { message: error.message });
            }
        });
        // Handle incoming chat messages
        socket.on('chatMessage', async ({ sessionId, message, senderId }) => {
            console.log(`Message from ${senderId} in ${sessionId}: ${message}`);
            // Emit the message to all clients in the session, including sender ID
            io.to(`session-${sessionId}`).emit('newMessage', { sessionId, message, senderId });
            console.log(`Emitted message to session ${sessionId}: ${message} from ${senderId}`);
        });
        // Handle closing the chat session
        socket.on('closeChatSession', async ({ sessionId }) => {
            try {
                await ChatController.updateSessionStatus({ body: { sessionId, status: 'completed' } });
                socket.leave(`session-${sessionId}`);
                console.log(`${socket.id} closed chat session: ${sessionId}`);
                io.to(`session-${sessionId}`).emit('sessionClosed', { sessionId });
            } catch (error) {
                console.error('Error closing chat session:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = initializeSocket;
