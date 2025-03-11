require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { AccessToken, VideoGrant } = require('livekit-server-sdk');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Socket.IO logic for multiplayer
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.broadcast.emit('playerJoined', { id: socket.id });

  socket.on('updatePosition', (data) => {
    socket.broadcast.emit('playerMoved', { id: socket.id, position: data });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    io.emit('playerLeft', { id: socket.id });
  });
});

app.get('/api/token', async (req, res) => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const roomName = 'room-name';

  // Get username from query params
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: username,
    name: username,
    metadata: 'metadata',
  });

  const videoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  };

  token.addGrant(videoGrant);

  try {
    const jwt = await token.toJwt();
    console.log(jwt);
    res.json({ token: jwt });
  } catch (err) {
    console.error('Error generating token:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
