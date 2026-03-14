const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  companyName: { type: String },
  quantity: { type: Number, required: true },
  averageBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, default: 0 },
  sector: { type: String, default: 'Unknown' },
});

holdingSchema.virtual('totalInvested').get(function () {
  return this.quantity * this.averageBuyPrice;
});

holdingSchema.virtual('currentValue').get(function () {
  return this.quantity * this.currentPrice;
});

holdingSchema.virtual('pnl').get(function () {
  return this.currentValue - this.totalInvested;
});

holdingSchema.virtual('pnlPercent').get(function () {
  if (this.totalInvested === 0) return 0;
  return ((this.pnl / this.totalInvested) * 100).toFixed(2);
});

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'My Portfolio' },
    holdings: [holdingSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);