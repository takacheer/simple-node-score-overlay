const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.static(path.join(__dirname, 'public')));

function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data file:", err);
        return { isVisible: false, nameLeft: "TEAM A", scoreLeft: 0, nameRight: "TEAM B", scoreRight: 0, logoUrl: "" };
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing data file:", err);
    }
}

io.on('connection', (socket) => {
    socket.emit('updateOverlay', loadData());

    socket.on('sendUpdate', (newData) => {
        saveData(newData); 
        io.emit('updateOverlay', newData); 
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});