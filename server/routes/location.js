const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const LocationShare = require('../models/LocationShare');

// POST - start a new live share session
router.post('/start', async (req, res) => {
  try {
    const { durationMinutes } = req.body;
    const shareId = crypto.randomBytes(4).toString('hex');
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const share = new LocationShare({ shareId, expiresAt });
    await share.save();

    res.status(201).json(share);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - fetch a share session's current state (used by the viewer page)
router.get('/:shareId', async (req, res) => {
  try {
    const share = await LocationShare.findOne({ shareId: req.params.shareId });
    if (!share) return res.status(404).json({ error: 'Share not found' });
    res.json(share);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH - stop a share session
router.patch('/:shareId/stop', async (req, res) => {
  try {
    const share = await LocationShare.findOneAndUpdate(
      { shareId: req.params.shareId },
      { active: false },
      { new: true }
    );
    res.json(share);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;