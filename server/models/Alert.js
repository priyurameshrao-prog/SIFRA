const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },
  contactsNotified: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);