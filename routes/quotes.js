
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const QuoteRequest = require('../models/QuoteRequest');

// @route   GET api/quotes
// @desc    Get all quote requests for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const quotes = await QuoteRequest.find({ userId: req.user.id });
    res.json(quotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/quotes
// @desc    Create a new quote request
// @access  Private
router.post('/', auth, async (req, res) => {
  const { packageIds } = req.body;

  try {
    const newQuote = new QuoteRequest({
      userId: req.user.id,
      packageIds,
      status: 'pending'
    });

    const quote = await newQuote.save();
    res.json(quote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
