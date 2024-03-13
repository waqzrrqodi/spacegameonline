const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Import the required modules

// Create an Express app
const app = express();
const server = http.createServer(app);

// Create a Socket.IO instance
const io = socketIO(server);

// Define a connection event handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle the disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Handle custom events
    socket.on('customEvent', (data) => {
        console.log('Received custom event:', data);
        // Handle the event logic here
    });
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});