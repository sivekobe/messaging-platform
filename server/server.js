const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const wss = new WebSocket.Server({ noServer: true });
require('dotenv').config();
const { JWT_SECRET, PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/messaging_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);

// WebSocket
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const { sender, content } = JSON.parse(message);
    const newMessage = new Message({ sender, content });
    await newMessage.save();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    });
  });
});

// Server and WebSocket upgrade
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
