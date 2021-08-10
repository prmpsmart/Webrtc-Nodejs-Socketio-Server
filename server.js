const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

const PORT = process.env.PORT || 3050;

const server = http.createServer(app);

const io = socketio(server);

const users = [];

app.get('/', (req, res) => {
    res.send("Server running");
});

// run when client connects
io.on('connection', socket => {

    console.log(socket.id + ' connected');
    socket.on('connectUser', userData => {
        users.push(userData);
        socket.userId = userData["id"];
        socket.join(userData["id"]);

        // socket.emit("users", users.filter(
        //     user => user["id"] !== socket.userId
        // ));

        // io.emit("users", [user]);
        io.emit('users', users);
    });

    socket.on('call-user', data => {
        console.log(data);
        /// SDP
        /// TO
        /// FROm
        io.to(data.to).emit('call-made', data);
    });

    socket.on('make-answer', data => {
        console.log(data);
        /// SDP
        /// TO
        /// FROm
        io.to(data.to).emit('answer-made', data);
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