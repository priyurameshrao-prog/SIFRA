const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Contact = require('../models/Contact');

// POST - trigger a new SOS alert
router.post('/', async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Notify all saved contacts (for now, all of them)
    const contacts = await Contact.find();
    const contactIds = contacts.map((c) => c._id);

    const newAlert = new Alert({
      location: { lat, lng },
      contactsNotified: contactIds,
    });

    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - fetch alert history (most recent first)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('contactsNotified', 'name phone')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH - mark an alert as resolved
router.patch('/:id/resolve', async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    res.json(updatedAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
