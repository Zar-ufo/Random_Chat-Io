// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let chatHistory = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('setUsername', (username) => {
        socket.username = username;
        socket.emit('chatHistory', chatHistory); // Send chat history to the new user
        io.emit('userConnected', username);
    });

    socket.on('chatMessage', (msg) => {
        if (!socket.username) return; // Ensure username is set
        const timestamp = new Date();
        const message = { username: socket.username, message: msg, timestamp };
        chatHistory.push(message); // Store chat message in history
        io.emit('chatMessage', message);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('userDisconnected', socket.username);
            console.log('user disconnected');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
