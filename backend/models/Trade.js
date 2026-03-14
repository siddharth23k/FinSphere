const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    companyName: { type: String },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    sector: { type: String, default: 'Unknown' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trade', tradeSchema);