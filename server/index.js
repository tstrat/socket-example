const express = require('express');
const massive = require('massive');
require('dotenv').config();
const app = express();
const server = require('http').Server(app);
const config = { pingTimeout: 60000 };

const io = require('socket.io')(server, config);

const { SERVER_PORT, CONNECTION_STRING } = process.env;

massive(CONNECTION_STRING).then(dbInstance => {
    app.set('db', dbInstance);
    console.log('Successfully Connected to Database');
});

//endpoints here

server.listen(SERVER_PORT || 4000, () =>
    console.log(`Server started, port: SERVER_PORT
Don't spook the monkey 🙈`)
);

let users = [];
io.on('connection', socket => {
    console.log('-new connection to server-', socket.id);

    socket.on('join', data => {
        socket.emit('login', {
            users: users,
            message: {
                username: 'Server',
                message: '- Welcome to Socket.IO Chat -'
            }
        });
        users.push({ id: socket.id, name: data });
        io.emit('user joined', users);
    });

    socket.on('new message', data => {
        io.emit('new message', data);
    });

    socket.on('disconnect', () => {
        let index = users.findIndex(u => u.id === socket.id);
        if (index > -1) {
            users.splice(index, 1);
        }
        console.log('disconnect', users);
        io.emit('user left', users);
    });
});
