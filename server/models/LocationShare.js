const mongoose = require('mongoose');

const locationShareSchema = new mongoose.Schema({
  shareId: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    lat: Number,
    lng: Number,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('LocationShare', locationShareSchema);