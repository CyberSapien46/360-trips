
const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    res.json(destination);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
