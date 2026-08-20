const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const LocationShare = require('./models/LocationShare');
require('dotenv').config();

const contactRoutes = require('./routes/contacts');
const alertRoutes = require('./routes/alerts');
const locationRoutes = require('./routes/location');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Women Safety App backend is running ✅');
});

app.use('/api/contacts', contactRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/location', locationRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-share', (shareId) => {
    socket.join(shareId);
  });

  socket.on('send-location', async ({ shareId, lat, lng }) => {
  io.to(shareId).emit('location-update', { lat, lng });

  try {
    await LocationShare.findOneAndUpdate(
      { shareId },
      { currentLocation: { lat, lng } }
    );
  } catch (err) {
    console.error('Failed to save location', err);
  }
});

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.log('MongoDB connection error ❌', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});