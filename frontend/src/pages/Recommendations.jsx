import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getPortfolio, getStockQuote, searchStocks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Recommendations.css';


const RECOMMENDATION_CARDS = [
  {
    label: 'SIP Plan',
    sub: 'Low Risk',
    icon: '🔄',
    tip: 'Start a monthly SIP in index funds like Nifty 50 for steady long-term growth.',
    details: [
      '📌 SIP (Systematic Investment Plan) lets you invest a fixed amount every month automatically.',
      '📈 Even $500/month in a S&P 500 index fund can grow significantly over 10–15 years due to compounding.',
      '✅ Best for: Beginners, salaried individuals, anyone who wants passive wealth building.',
      '⚠️ Tip: Stay consistent — avoid stopping SIPs during market dips. That is when you buy cheaper units.',
      '🏦 Popular options: Vanguard S&P 500 ETF, Fidelity 500 Index Fund.',
    ],
  },
  {
    label: 'Stock Type',
    sub: 'Long Term',
    icon: '📊',
    tip: 'Look for fundamentally strong large-cap stocks with consistent earnings growth.',
    details: [
      '📌 For long-term investing, focus on large-cap stocks — companies with strong balance sheets and consistent profits.',
      '🔍 Look for: Low debt-to-equity ratio, positive free cash flow, and 3–5 year earnings growth.',
      '✅ Best for: Investors with a 5+ year horizon who want relatively stable returns.',
      '⚠️ Avoid: Penny stocks, highly leveraged companies, or stocks hyped on social media.',
      '📚 Examples of categories: FMCG, IT, Banking blue-chips tend to be more stable long-term.',
    ],
  },
  {
    label: 'Emergency Fund',
    sub: '6 months',
    icon: '🛡️',
    tip: 'Keep 6 months of expenses in a liquid fund before investing aggressively.',
    details: [
      '📌 An emergency fund is 3–6 months of your monthly expenses kept in a highly liquid account.',
      '💡 Do this BEFORE investing in stocks — it prevents you from selling investments at a loss during emergencies.',
      '✅ Best for: Everyone, regardless of income level.',
      '🏦 Where to keep it: High-interest savings account, liquid mutual funds, or short-term FDs.',
      '⚠️ Do not invest your emergency fund in stocks or crypto — it must be instantly accessible.',
    ],
  },
  {
    label: 'Asset Split',
    sub: 'Equity/Debt',
    icon: '⚖️',
    tip: 'A 70/30 equity-to-debt split works well for moderate risk investors.',
    details: [
      '📌 Asset allocation means dividing your money between different types of investments to manage risk.',
      '📊 Common splits by risk appetite:',
      '   • Aggressive (High Risk): 90% Equity, 10% Debt',
      '   • Moderate (Medium Risk): 70% Equity, 30% Debt',
      '   • Conservative (Low Risk): 40% Equity, 60% Debt',
      '✅ Equity = stocks/equity mutual funds. Debt = bonds, FDs, debt mutual funds.',
      '🔄 Rebalance once a year to maintain your target allocation.',
    ],
  },
  {
    label: 'Tax Saving',
    sub: '401(k)',
    icon: '💸',
    tip: 'Invest in index funds to save tax under Section 401(k) (up to $19,500).',
    details: [
      '📌 401(k) is a retirement savings plan that qualifies for tax deduction under Section 401(k).',
      '💰 You can save up to $4,680 in taxes per year by investing $19,500 in 401(k).',
      '⏳ Lock-in period: 3 years (shortest among all retirement plans).',
      '✅ Best for: Salaried individuals in 20–30% tax bracket who also want equity growth.',
      '⚠️ Returns are market-linked and not guaranteed — but historically 401(k) has given 10–12% CAGR over long periods.',
      '🏦 Popular options: Vanguard Target Retirement Fund, Fidelity 401(k) Index Fund.',
    ],
  },
];

const Recommendations = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
    const [activeCard, setActiveCard] = useState(null); // which rec card is expanded

  useEffect(() => {
    getPortfolio().then((r) => setPortfolio(r.data)).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length >= 2) {
      try {
        const res = await searchStocks(q);
        setSearchResults(res.data);
      } catch { setSearchResults([]); }
    } else { setSearchResults([]); }
  };

  const selectStock = async (stock) => {
    setSearchResults([]);
    setSearchQuery(stock.name);
    setQuoteLoading(true);
    try {
      const res = await getStockQuote(stock.symbol);
      setSelectedStock({ ...stock, quote: res.data });
    } catch {
      setSelectedStock({ ...stock, quote: null });
    }
    setQuoteLoading(false);
  };

  
  const totalInvested = portfolio?.holdings?.reduce((a, h) => a + h.quantity * h.averageBuyPrice, 0) || 0;
  const currentValue = portfolio?.holdings?.reduce((a, h) => a + h.quantity * (h.currentPrice || h.averageBuyPrice), 0) || 0;
  const pnl = currentValue - totalInvested;

  const topHolding = portfolio?.holdings?.sort((a, b) => b.quantity * b.averageBuyPrice - a.quantity * a.averageBuyPrice)[0];
  const topAlloc = topHolding && totalInvested > 0 ? ((topHolding.quantity * topHolding.averageBuyPrice / totalInvested) * 100).toFixed(1) : 0;

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content fade-in">
        <div className="page-header">
          <h1>Explore & Recommendations</h1>
          <p>Your personalized financial insights based on your profile.</p>
        </div>

        <div className="rec-layout">
          {/* Left: Stock Explorer + Portfolio Analytics */}
          <div className="rec-left">
            {/* Stock Explorer */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px' }}>🔍 Stock Explorer</h3>
              <div style={{ position: 'relative' }}>
                <input className="input" placeholder="Search for a stock..." value={searchQuery} onChange={handleSearch} />
                {searchResults.length > 0 && (
                  <ul className="search-dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', listStyle: 'none', zIndex: 10, marginTop: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                    {searchResults.map((s) => (
                      <li key={s.symbol} onClick={() => selectStock(s)} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                        <strong>{s.symbol}</strong> — {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {quoteLoading && <div style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Fetching quote...</div>}

              {selectedStock && !quoteLoading && (
                <div className="stock-detail">
                  <div className="stock-detail-header">
                    <div>
                      <h2>{selectedStock.symbol}</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{selectedStock.name}</p>
                    </div>
                    {selectedStock.quote && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '700' }}>
                          ${selectedStock.quote.price?.toFixed(2)}
                        </div>
                        <div className={selectedStock.quote.change >= 0 ? 'positive' : 'negative'}>
                          {selectedStock.quote.change >= 0 ? '+' : ''}{selectedStock.quote.change?.toFixed(2)} ({selectedStock.quote.changePercent})
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedStock.quote && (
                    <div className="stock-metrics">
                      <div><span>High</span><strong>${selectedStock.quote.high?.toFixed(2)}</strong></div>
                      <div><span>Low</span><strong>${selectedStock.quote.low?.toFixed(2)}</strong></div>
                      <div><span>Prev Close</span><strong>${selectedStock.quote.previousClose?.toFixed(2)}</strong></div>
                      <div><span>Volume</span><strong>{Number(selectedStock.quote.volume).toLocaleString('en-IN')}</strong></div>
                    </div>
                  )}
                  {!selectedStock.quote && <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>Could not fetch real-time data. Check API key.</p>}
                </div>
              )}
            </div>

            {/* Portfolio Analytics */}
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>📊 Portfolio Analytics</h3>
              <div className="analytics-row">
                <div className="analytics-item">
                  <span>P&L</span>
                  <strong className={pnl >= 0 ? 'positive' : 'negative'}>
                    {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </strong>
                </div>
                <div className="analytics-item">
                  <span>Stocks Held</span>
                  <strong>{portfolio?.holdings?.length || 0}</strong>
                </div>
                <div className="analytics-item">
                  <span>Top Holding</span>
                  <strong>{topHolding?.symbol || '—'} ({topAlloc}%)</strong>
                </div>
              </div>
              <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>Portfolio Summary: </strong>
                {portfolio?.holdings?.length > 0
                  ? `Your portfolio has ${portfolio.holdings.length} holdings with ${pnl >= 0 ? 'a gain' : 'a loss'} of $${Math.abs(pnl).toFixed(0)}. ${topAlloc > 40 ? `⚠ ${topHolding?.symbol} takes up ${topAlloc}% — consider diversifying.` : 'Diversification looks reasonable.'}`
                  : 'Start adding holdings to get personalized insights on your portfolio.'}
              </div>
            </div>
          </div>

          {/* Right: Profile Snapshot + Recommendation Cards + Simulation */}
          <div className="rec-right">
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '12px' }}>👤 Your Profile Snapshot</h3>
              <div className="profile-snapshot">
                <div><span>Risk</span><strong>{user?.riskAppetite || 'Medium'}</strong></div>
                <div><span>Level</span><strong>{user?.experienceLevel || 'Beginner'}</strong></div>
                <div><span>Balance</span><strong>${Number(user?.virtualBalance || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong></div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                Goal: Wealth Growth · Time Horizon: Long Term
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '4px' }}>🎯 Recommendation Cards</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Click any card to learn more</p>
              <div className="rec-cards-grid">
                {RECOMMENDATION_CARDS.map((r) => {
                  const isOpen = activeCard === r.label;
                  return (
                    <div key={r.label}>
                      {/* Card Row */}
                      <div
                        className="rec-card"
                        onClick={() => setActiveCard(isOpen ? null : r.label)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: isOpen ? '8px 8px 0 0' : '8px',
                          borderBottom: isOpen ? '1px solid var(--accent-gold)' : undefined,
                          background: isOpen ? 'var(--bg-secondary)' : undefined,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span className="rec-card-icon">{r.icon}</span>
                        <div style={{ flex: 1 }}>
                          <strong>{r.label}</strong>
                          <p>{r.sub}</p>
                        </div>
                        <span style={{
                          fontSize: '16px',
                          color: 'var(--text-muted)',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          marginLeft: '8px',
                        }}>▾</span>
                      </div>

                      {/* Expanded Detail Panel */}
                      {isOpen && (
                        <div style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderTop: 'none',
                          borderRadius: '0 0 8px 8px',
                          padding: '16px',
                          marginBottom: '4px',
                        }}>
                          <p style={{
                            fontSize: '13px',
                            color: 'var(--accent-gold)',
                            fontWeight: '600',
                            marginBottom: '10px',
                          }}>{r.tip}</p>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {r.details.map((d, i) => (
                              <li key={i} style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                paddingLeft: d.startsWith('   ') ? '16px' : '0',
                              }}>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;