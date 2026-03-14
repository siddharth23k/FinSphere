const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Trade = require('../models/Trade');

// @GET /api/trades - Get all trades for the user
router.get('/', protect, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/trades/recent - Get last 5 trades
router.get('/recent', protect, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;