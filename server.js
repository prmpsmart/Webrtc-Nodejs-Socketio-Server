const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

const PORT = process.env.PORT || 3050;

const server = http.createServer(app);

const io = socketio(server);

const rooms = {};

app.get('/', (req, res) => {
    res.send("Server running");
});

// run when client connects
io.on('connection', socket => {

    console.log(socket.id + ' connected');

    socket.on('join-room', roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }

        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit('other-user', otherUser);
            socket.to(otherUser).emit('user joined', socket.id);
        }
    });

    socket.on('offer', sdp => {
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('offer', payload);
    });

    // listen for the answer event
    socket.on('answer', sdp => {
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('answer', sdp);
    });

    socket.on('caller-ice-candidate', incoming => {
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('caller-ice-candidate', incoming.candidate);
    });

    socket.on('callee-ice-candidate', incoming => {
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('callee-ice-candidate', incoming.candidate);
    });

    socket.on('disconnect', () => {
        console.log(socket.userId + ' disconnected');
    });
});

server.listen(PORT, () => console.log("Server running on port " + PORT));