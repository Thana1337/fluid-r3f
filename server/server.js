const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // For development; restrict this in production
  },
});

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Notify others that a new player joined
  socket.broadcast.emit('playerJoined', { id: socket.id });

  // Listen for position updates from this client
  socket.on('updatePosition', (data) => {
    // Broadcast the update to all other clients
    socket.broadcast.emit('playerMoved', { id: socket.id, position: data });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    io.emit('playerLeft', { id: socket.id });
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
