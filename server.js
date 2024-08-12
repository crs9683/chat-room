const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle user joining with a username
    socket.on('set username', (username) => {
        socket.username = username;
        io.emit('chat message', `${username} has joined the chat`);

        // Update members presence
        updateMembers();
    });

    // Handle incoming messages with the user's username
    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.username}: ${msg}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('chat message', `${socket.username} has left the chat`);
            updateMembers();
        }
        console.log('user disconnected');
    });

    // Function to update and emit members presence
    function updateMembers() {
        const members = Array.from(io.sockets.sockets.keys()).map(socketId => {
            return io.sockets.sockets.get(socketId).username;
        });
        io.emit('members presence', members);
    }
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});