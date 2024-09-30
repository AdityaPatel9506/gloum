const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // Adjust this path
const request = require('supertest');

const server = http.createServer(app);
const io = new Server(server);

// Sample test case
describe('Chat functionality', () => {
    let clientSocket;

    beforeAll((done) => {
        clientSocket = require('socket.io-client')(server);
        clientSocket.on('connect', done);
    });

    afterAll((done) => {
        clientSocket.disconnect();
        server.close(done);
    });

    it('should send a chat message', (done) => {
        const sessionId = 'test-session';
        const message = 'Hello, World!';
        const senderId = 'user-1';

        clientSocket.emit('joinRoom', { sessionId });
        clientSocket.emit('chatMessage', { sessionId, message, senderId });

        clientSocket.on('message', (data) => {
            expect(data.message).toBe(message);
            expect(data.senderId).toBe(senderId);
            done();
        });
    });
});
