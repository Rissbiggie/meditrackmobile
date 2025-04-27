const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected clients
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle client authentication
  socket.on('authenticate', (userData) => {
    connectedClients.set(socket.id, {
      userId: userData.userId,
      role: userData.role,
      socket: socket
    });
    console.log(`User ${userData.userId} authenticated as ${userData.role}`);
  });

  // Handle new alerts
  socket.on('newAlert', (alert) => {
    console.log('New alert received:', alert);
    // Broadcast to all response team members
    connectedClients.forEach((client) => {
      if (client.role === 'responseTeam') {
        client.socket.emit('alertUpdate', alert);
      }
    });
  });

  // Handle alert updates
  socket.on('alertUpdate', (update) => {
    console.log('Alert update received:', update);
    // Notify the victim and relevant response team
    connectedClients.forEach((client) => {
      if (client.role === 'responseTeam' || client.userId === update.victimId) {
        client.socket.emit('alertUpdate', update);
      }
    });
  });

  // Handle location updates
  socket.on('locationUpdate', (data) => {
    console.log('Location update received:', data);
    // Broadcast to relevant response team members
    connectedClients.forEach((client) => {
      if (client.role === 'responseTeam') {
        client.socket.emit('locationUpdate', data);
      }
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 