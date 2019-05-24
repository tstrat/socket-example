const express = require('express');
const app = express();

// socket modules
const server = require('http').Server(app);
const io = require('socket.io')(server);
const socketController = require('./controllers/socketController');

io.on('connection', socket => {
    // When a client connects run this function
    console.log('A connection happened', socket.id);

    // When the client sends 'needy' and a roomid add them to the room
    socket.on('needy', roomid => socketController.joinRoom(roomid, socket, io));

    // When the client sends a message to the server send it to everyone
    socket.on('message to server', payload =>
        socketController.sendMessageToRoom(payload, io)
    );
});

// SERVER instead of APP
server.listen(4000, () => console.log('Best LESSON EVER! Sockets are cool'));
