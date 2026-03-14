const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios');

const FH_KEY = process.env.FINNHUB_API_KEY;
const FH_BASE = 'https://finnhub.io/api/v1';

// @GET /api/stocks/quote/:symbol
router.get('/quote/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params;
    const [quoteRes, profileRes] = await Promise.all([
      axios.get(`${FH_BASE}/quote`, { params: { symbol, token: FH_KEY } }),
      axios.get(`${FH_BASE}/stock/profile2`, { params: { symbol, token: FH_KEY } }),
    ]);
    const q = quoteRes.data;
    if (!q || q.c === 0) return res.status(404).json({ message: 'Stock not found' });
    res.json({
      symbol,
      name: profileRes.data.name || symbol,
      price: q.c,
      change: q.d,
      changePercent: q.dp ? `${q.dp.toFixed(2)}%` : '0%',
      high: q.h,
      low: q.l,
      open: q.o,
      previousClose: q.pc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/stocks/search/:query
router.get('/search/:query', protect, async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(`${FH_BASE}/search`, {
      params: { q: query, token: FH_KEY },
    });
    const results = response.data.result || [];
    res.json(results.slice(0, 8).map((r) => ({
      symbol: r.symbol,
      name: r.description,
      type: r.type,
      region: 'US',
      currency: 'USD',
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/stocks/history/:symbol
router.get('/history/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params;
    const to = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 60 * 60;
    const response = await axios.get(`${FH_BASE}/stock/candle`, {
      params: { symbol, resolution: 'D', from, to, token: FH_KEY },
    });
    const d = response.data;
    if (!d || d.s === 'no_data') return res.status(404).json({ message: 'No data' });
    const data = d.t.map((timestamp, i) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: d.o[i], high: d.h[i], low: d.l[i], close: d.c[i], volume: d.v[i],
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/stocks/news
router.get('/news', protect, async (req, res) => {
  try {
    const response = await axios.get(`${FH_BASE}/news`, {
      params: { category: 'general', token: FH_KEY },
    });
    const feed = response.data || [];
    res.json(feed.slice(0, 20).map((item) => ({
      title: item.headline,
      url: item.url,
      summary: item.summary,
      source: item.source,
      publishedAt: new Date(item.datetime * 1000).toISOString(),
      sentiment: null,
      image: item.image,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;