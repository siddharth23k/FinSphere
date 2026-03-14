import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Learn.css';

const tracks = [
  {
    id: 'basics',
    title: 'Finance Basics',
    icon: '🏦',
    status: 'available',
    modules: [
      { title: 'What is the Stock Market?', content: 'The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. When you buy a stock, you own a small piece of that company. Stock prices fluctuate based on supply, demand, company performance, and economic factors.\n\n**Key Terms:**\n• **Bull Market** – Prices are rising (optimistic market)\n• **Bear Market** – Prices are falling (pessimistic market)\n• **Index** – A benchmark like Nifty 50 that tracks top companies\n• **Dividend** – A portion of company profits paid to shareholders' },
      { title: 'Understanding Risk vs Return', content: 'Every investment carries risk. Higher potential returns usually come with higher risk. As an investor, you must find your comfort level.\n\n**Types of Risk:**\n• **Market Risk** – The whole market falls\n• **Company Risk** – A specific company performs badly\n• **Liquidity Risk** – You can\'t sell your investment easily\n\n**Risk vs Return principle:** Government bonds are low-risk/low-return. Small-cap stocks are high-risk/high-return. Diversification helps manage risk.' },
      { title: 'How to Read a Stock Chart', content: 'Stock charts show historical price movements over time. Learning to read them is essential.\n\n**Key Chart Elements:**\n• **Candlestick** – Shows open, high, low, close price for a period\n• **Green candle** – Price closed higher than it opened\n• **Red candle** – Price closed lower than it opened\n• **Volume** – Number of shares traded (higher = more conviction)\n• **Moving Average** – Smoothed price trend line (e.g., 50-day MA)' },
    ],
  },
  {
    id: 'investing',
    title: 'Investing Strategies',
    icon: '📈',
    status: 'available',
    modules: [
      { title: 'Value Investing', content: 'Value investing is buying stocks that appear underpriced relative to their intrinsic value. Made famous by Warren Buffett and Benjamin Graham.\n\n**Key Metrics:**\n• **P/E Ratio** – Price to Earnings (lower may = undervalued)\n• **P/B Ratio** – Price to Book value\n• **EPS** – Earnings per share\n• **Margin of Safety** – Buying below intrinsic value as a buffer\n\nThe idea: Mr. Market is emotional. Smart investors wait for prices to fall below true value, then buy.' },
      { title: 'Growth Investing', content: 'Growth investing focuses on companies expected to grow faster than average, even if currently expensive.\n\n**What to look for:**\n• High revenue growth (20%+ year-over-year)\n• Expanding market share\n• Strong competitive moat\n• Reinvesting profits instead of paying dividends\n\nExamples: Tech companies, EV companies, fintech startups. Higher risk but potentially very high reward over long term.' },
      { title: 'SIP & Rupee Cost Averaging', content: 'A Systematic Investment Plan (SIP) means investing a fixed amount regularly, regardless of market conditions.\n\n**Why it works:**\n• You buy more units when prices are low\n• You buy fewer units when prices are high\n• Average cost per unit reduces over time\n• Removes emotional decision-making\n\nExample: Invest ₹5,000 every month in a Nifty 50 index fund. Over 10 years, market ups and downs average out.' },
    ],
  },
  {
    id: 'budgeting',
    title: 'Budgeting',
    icon: '💰',
    status: 'available',
    modules: [
      { title: '50/30/20 Rule', content: 'The 50/30/20 rule is a simple budgeting framework.\n\n**How it works:**\n• **50%** of income → Needs (rent, food, bills)\n• **30%** of income → Wants (entertainment, dining out)\n• **20%** of income → Savings & investments\n\nExample: If you earn ₹50,000/month:\n• ₹25,000 → Essentials\n• ₹15,000 → Lifestyle\n• ₹10,000 → Invest/Save\n\nThis is a starting point — adjust based on your goals.' },
      { title: 'Emergency Fund', content: 'An emergency fund is 3–6 months of living expenses kept in liquid savings.\n\n**Why it matters:**\n• Job loss or medical emergency won\'t force you to sell investments\n• Prevents taking on high-interest debt\n• Gives psychological safety to take investment risks\n\n**Where to keep it:** High-yield savings account or liquid mutual fund — accessible within 1–2 days, not locked away.' },
    ],
  },
  {
    id: 'stocks',
    title: 'Stock Analysis',
    icon: '🔬',
    status: 'available',
    modules: [
      { title: 'Fundamental Analysis', content: 'Fundamental analysis evaluates a company\'s financial health and intrinsic value.\n\n**Key Financial Statements:**\n• **Income Statement** – Revenue, expenses, profit\n• **Balance Sheet** – Assets, liabilities, equity\n• **Cash Flow Statement** – Actual cash movement\n\n**Key Ratios:**\n• P/E Ratio (Price/Earnings)\n• ROE (Return on Equity)\n• Debt-to-Equity Ratio\n• Operating Margin\n\nGoal: Find fundamentally strong companies trading at fair or low prices.' },
      { title: 'Technical Analysis Basics', content: 'Technical analysis uses price and volume patterns to predict future movements.\n\n**Common Indicators:**\n• **RSI (Relative Strength Index)** – Above 70 = overbought, Below 30 = oversold\n• **MACD** – Trend momentum indicator\n• **Bollinger Bands** – Price volatility bands\n• **Support & Resistance** – Price levels where stocks tend to reverse\n\nNote: Technical analysis works better for short-term trading. Fundamental analysis is better for long-term investing.' },
    ],
  },
  { id: 'mutualfunds', title: 'Mutual Funds', icon: '🏛️', status: 'locked', modules: [] },
  { id: 'taxsip', title: 'Tax & SIP', icon: '📋', status: 'locked', modules: [] },
];

const Learn = () => {
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [completed, setCompleted] = useState({});

  const markComplete = () => {
    const key = `${activeTrack.id}-${activeModule}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isCompleted = (trackId, moduleIdx) => completed[`${trackId}-${moduleIdx}`];

  const formatContent = (text) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} style={{ marginTop: '16px', marginBottom: '8px', color: 'var(--accent-gold)' }}>{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('• ')) {
        return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', color: 'var(--text-secondary)' }}>{line.slice(2).replace(/\*\*([^*]+)\*\*/g, '$1')}</li>;
      }
      if (line === '') return <br key={i} />;
      return <p key={i} style={{ marginBottom: '8px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{line.replace(/\*\*([^*]+)\*\*/g, '$1')}</p>;
    });

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content fade-in">
        {!activeTrack ? (
          <>
            <div className="page-header">
              <h1>Learn Finance</h1>
              <p>Learn Personal Finance, Step by Step</p>
            </div>

            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${(Object.values(completed).filter(Boolean).length / 11) * 100}%` }} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '32px', marginTop: '8px' }}>
              {Object.values(completed).filter(Boolean).length} / 11 modules completed
            </p>

            <div className="tracks-grid">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`track-card card ${track.status === 'locked' ? 'locked' : ''}`}
                  onClick={() => track.status !== 'locked' && setActiveTrack(track)}
                >
                  <div className="track-icon">{track.icon}</div>
                  <h3>{track.title}</h3>
                  {track.status === 'locked' ? (
                    <span className="tag tag-gold">🔒 Locked</span>
                  ) : (
                    <span className="tag tag-green">✓ Available</span>
                  )}
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {track.modules.length} modules
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" style={{ marginBottom: '24px' }} onClick={() => { setActiveTrack(null); setActiveModule(0); }}>
              ← Back to Tracks
            </button>

            <div className="learn-layout">
              {/* Module List */}
              <div className="module-list card">
                <h3 style={{ marginBottom: '16px' }}>{activeTrack.title}</h3>
                {activeTrack.modules.map((m, i) => (
                  <div
                    key={i}
                    className={`module-item ${activeModule === i ? 'active' : ''} ${isCompleted(activeTrack.id, i) ? 'done' : ''}`}
                    onClick={() => setActiveModule(i)}
                  >
                    <span>{isCompleted(activeTrack.id, i) ? '✅' : `${i + 1}.`}</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>

              {/* Module Content */}
              <div className="module-content card">
                <h2>{activeTrack.modules[activeModule]?.title}</h2>
                <div className="module-body">
                  {formatContent(activeTrack.modules[activeModule]?.content || '')}
                </div>

                <div className="module-ai-help">
                  <h4>💡 AI Help</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    "Explain this in simple terms" or "Give a real-world example" — use the Recommendations page to chat about concepts.
                  </p>
                </div>

                <div className="module-nav">
                  <button className="btn btn-secondary" disabled={activeModule === 0} onClick={() => setActiveModule(activeModule - 1)}>← Previous</button>
                  <button
                    className={`btn ${isCompleted(activeTrack.id, activeModule) ? 'btn-success' : 'btn-secondary'}`}
                    onClick={markComplete}
                  >
                    {isCompleted(activeTrack.id, activeModule) ? '✅ Completed — Click to Undo' : 'Mark Complete'}
                  </button>
                  <button className="btn btn-secondary"
                    disabled={activeModule === activeTrack.modules.length - 1}
                    onClick={() => { markComplete(); setActiveModule(activeModule + 1); }}>
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Learn;