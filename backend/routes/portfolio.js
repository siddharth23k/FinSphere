const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Portfolio = require('../models/Portfolio');
const Trade = require('../models/Trade');
const User = require('../models/User');

// @GET /api/portfolio - Get user's portfolio
router.get('/', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/portfolio/buy - Buy a stock
router.post('/buy', protect, async (req, res) => {
  const { symbol, companyName, quantity, price, sector } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const totalCost = quantity * price;

    if (user.virtualBalance < totalCost) {
      return res.status(400).json({ message: 'Insufficient virtual balance' });
    }

    // Deduct balance
    user.virtualBalance -= totalCost;
    user.totalInvested += totalCost;
    await user.save();

    // Update portfolio
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    const existingHolding = portfolio.holdings.find((h) => h.symbol === symbol);

    if (existingHolding) {
      const totalQty = existingHolding.quantity + quantity;
      const totalInvested = existingHolding.averageBuyPrice * existingHolding.quantity + price * quantity;
      existingHolding.averageBuyPrice = totalInvested / totalQty;
      existingHolding.quantity = totalQty;
      existingHolding.currentPrice = price;
    } else {
      portfolio.holdings.push({ symbol, companyName, quantity, averageBuyPrice: price, currentPrice: price, sector });
    }

    await portfolio.save();

    // Log trade
    await Trade.create({ user: req.user._id, symbol, companyName, type: 'BUY', quantity, price, total: totalCost, sector });

    res.json({ message: 'Stock purchased successfully', virtualBalance: user.virtualBalance, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/portfolio/sell - Sell a stock
router.post('/sell', protect, async (req, res) => {
  const { symbol, quantity, price } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    const holdingIndex = portfolio.holdings.findIndex((h) => h.symbol === symbol);
    if (holdingIndex === -1) return res.status(400).json({ message: 'Stock not in portfolio' });

    const holding = portfolio.holdings[holdingIndex];
    if (holding.quantity < quantity) return res.status(400).json({ message: 'Not enough shares to sell' });

    const saleValue = quantity * price;

    // Update balance
    user.virtualBalance += saleValue;
    user.totalInvested -= holding.averageBuyPrice * quantity;
    await user.save();

    // Update holding
    if (holding.quantity === quantity) {
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      holding.quantity -= quantity;
    }

    await portfolio.save();

    // Log trade
    await Trade.create({
      user: req.user._id,
      symbol,
      companyName: holding.companyName,
      type: 'SELL',
      quantity,
      price,
      total: saleValue,
      sector: holding.sector,
    });

    res.json({ message: 'Stock sold successfully', virtualBalance: user.virtualBalance, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;