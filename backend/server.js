const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const stockRoutes = require('./routes/stocks');
const tradeRoutes = require('./routes/trades');

const app = express();

const corsOptions = {
  origin: [
    'https://finsphere-eight.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.options('*', cors(corsOptions));  // preflight
app.use(cors(corsOptions));           // all other requests
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trades', tradeRoutes);

app.get('/', (req, res) => res.json({ message: 'FinSphere API running' }));

// Test route
app.get('/api/test-env', (req, res) => {
  res.json({
    mongo: process.env.MONGO_URI ? '✅ Set' : '❌ Missing',
    jwt: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
    finnhub: process.env.FINNHUB_API_KEY ? '✅ Set' : '❌ Missing'
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected to:', process.env.MONGO_URI?.split('@')[1]?.split('.')[0] || 'Unknown DB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.error('🔗 Connection string:', process.env.MONGO_URI ? 'Set' : 'Missing');
  });