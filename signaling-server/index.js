const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle join room
  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // Handle sending offer
  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  // Handle sending answer
  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  // Handle ICE candidates
  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', payload);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 6000;
server.listen(PORT, () => console.log(`Signaling Server running on port ${PORT}`));
