
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VRBooking = require('../models/VRBooking');

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await VRBooking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  const { date, time, address, additionalNotes } = req.body;
  
  try {
    // Check if user already has an active booking
    const activeBooking = await VRBooking.findOne({
      userId: req.user.id,
      status: { $nin: ['cancelled', 'completed'] }
    });
    
    if (activeBooking) {
      return res.status(400).json({ 
        msg: 'You already have an active booking' 
      });
    }
    
    const newBooking = new VRBooking({
      userId: req.user.id,
      date,
      time,
      address,
      status: 'pending',
      additionalNotes
    });
    
    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Cancel booking
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    const booking = await VRBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
