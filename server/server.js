const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const contactRoutes = require('./routes/contacts');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Women Safety App backend is running ✅');
});

app.use('/api/contacts', contactRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.log('MongoDB connection error ❌', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});