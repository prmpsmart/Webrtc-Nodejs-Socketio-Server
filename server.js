const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

const PORT = process.env.PORT || 3050;

const server = http.createServer(app);

const io = socketio(server);

let users = [];

app.get('/', (req, res) => {
    res.send("Server running");
});

io.on('connection', socket => {

    console.log(socket.id + ' connected');
    socket.on('connectUser', userData => {
        users.push(userData);
        socket.userId = userData["id"];
        socket.join(userData["id"]);
        io.emit('users', users);
    });

    socket.on('call-user', data => {
        console.log("Call User --> from:" + data["from"] + "   to:" + data["to"]);
        /// SDP
        /// TO
        /// FROM
        io.to(data.to).emit('call-made', data);
    });

    socket.on('make-answer', data => {
        console.log("Make Answer --> from:" + data["from"] + "   to:" + data["to"]);
        /// SDP
        /// TO
        /// FROM
        io.to(data.to).emit('answer-made', data);
    });

    socket.on('ice-candidate', data => {
        console.log("Ice Candidate --> from:" + data["from"] + "   to:" + data["to"]);
        /// CANDIDATE
        /// SDPMID
        /// SDPMLINEINDEX
        /// TO
        /// FROM
        io.to(data.to).emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log(socket.userId + ' disconnected');
        users = users.filter(
            user => user["id"] !== socket.userId
        );
        io.emit('users', users);
    });
});

server.listen(PORT, () => console.log("Server running on port " + PORT));