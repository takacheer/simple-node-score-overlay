const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let currentData = {
    nameLeft: "TEAM A", scoreLeft: 0,
    nameRight: "TEAM B", scoreRight: 0,
    logoUrl: ""
};

io.on('connection', (socket) => {
    socket.emit('updateOverlay', currentData);

    socket.on('sendUpdate', (data) => {
        currentData = data;
        io.emit('updateOverlay', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});