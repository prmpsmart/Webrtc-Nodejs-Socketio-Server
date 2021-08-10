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

    const roomID;

    socket.on('join-room', roomID => {
        console.log(socket.id + " joined the " + roomID);
        roomID = roomID;
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
        console.log(socket.id + " offer sdp " + roomID);
        room[roomID]["offer_sdp"] = sdp;
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('offer', sdp);
    });

    // listen for the answer event
    socket.on('answer', sdp => {
        console.log(socket.id + " answer sdp " + roomID);
        room[roomID]["answer_sdp"] = sdp;
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('answer', sdp);
    });

    socket.on('caller-ice-candidate', candidate => {
        console.log(socket.id + " caller candidate " + roomID);
        room[roomID]["caller_candidate"] = candidate;
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('caller-ice-candidate', candidate);
    });

    socket.on('calle-ice-candidate', candidate => {
        console.log(socket.id + " calle candidate " + roomID);
        room[roomID]["calle_candidate"] = candidate;
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        io.to(otherUser).emit('calle-ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log(socket.userId + ' disconnected');
    });
});

server.listen(PORT, () => console.log("Server running on port " + PORT));