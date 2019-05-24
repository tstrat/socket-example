module.exports = {
    joinRoom(roomid, socket, io) {
        // use the room id to "join" that room.  Now the server can send messages
        // to the room and this client will receive it.
        socket.join(roomid);
        io.in(roomid).emit('newbie joined', 'Hey there is a newbie!');
    },
    sendMessageToRoom(payload, io) {
        // console.log('new message', payload);

        // send the message to everyone in that room
        const { room, message } = payload;
        io.in(room).emit('new message from sever', message);
    },
    leaveRoom() {}
};
