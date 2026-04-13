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
      { title: 'Portfolio Management', content: 'Building and managing a diversified portfolio is key to long-term success.\n\n**Core Principles:**\n• **Diversification** – Spread investments across different sectors and asset classes\n• **Asset Allocation** – Balance between stocks, bonds, and cash based on your risk tolerance\n• **Rebalancing** – Periodically adjust your portfolio back to target allocations\n• **Risk Management** – Never invest more than you can afford to lose\n• **Long-term Perspective** – Focus on decades, not days or weeks' },
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
      { title: 'Debt Management', content: 'Understanding and managing debt is crucial for financial health.\n\n**Good Debt vs Bad Debt:**\n• **Good Debt** – Low-interest, tax-deductible (mortgage, student loans)\n• **Bad Debt** – High-interest, non-deductible (credit cards, personal loans)\n\n**Debt Payoff Strategies:**\n• **Avalanche Method** – Pay highest interest debt first\n• **Snowball Method** – Pay smallest balance first\n• **Debt Consolidation** – Combine multiple debts into one lower-rate loan' },
      { title: 'Retirement Planning', content: 'Start planning for retirement early, even if it seems far away.\n\n**Key Concepts:**\n• **Compound Interest** – Your money earning money on money\n• **401(k) Match** – Free money from your employer\n• **Rule of 72** – Divide savings rate by 72 to estimate years to double\n• **Sequence of Returns** – Withdraw from taxable accounts first\n\n**Retirement Accounts:**\n• **401(k)** – Employer-sponsored with tax benefits\n• **IRA** – Individual Retirement Account\n• **Roth IRA** – Tax-free growth and withdrawals' },
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
  { 
    id: 'mutualfunds', 
    title: 'Mutual Funds', 
    icon: '🏛️', 
    status: 'available',
    modules: [
      { 
        title: 'Introduction to Mutual Funds', 
        content: 'Mutual funds pool money from many investors to invest in stocks, bonds, and other securities.\n\n**How They Work:**\n• Professional fund managers handle investments\n• Diversification across multiple securities\n• Daily pricing based on net asset value (NAV)\n• Liquidity - easy to buy and sell\n\n**Types of Mutual Funds:**\n• **Equity Funds** - Invest in stocks\n• **Debt Funds** - Invest in bonds and fixed income\n• **Hybrid Funds** - Mix of equity and debt\n• **Index Funds** - Track market indices like S&P 500' 
      },
      { 
        title: 'Index Funds vs Active Funds', 
        content: 'Choose between passive index funds and actively managed funds.\n\n**Index Funds (Passive):**\n• Track market indices automatically\n• Lower expense ratios (0.1-0.5%)\n• Consistent with market performance\n• No fund manager decisions needed\n\n**Active Funds:**\n• Fund manager actively selects stocks\n• Higher expense ratios (1-2%+)\n• Potential to beat the market\n• Risk of underperformance\n\n**Evidence:** Most active funds underperform their benchmark indices over the long term.' 
      },
      { 
        title: 'Expense Ratios and Costs', 
        content: 'Understanding mutual fund costs is crucial for returns.\n\n**Types of Costs:**\n• **Expense Ratio** - Annual management fee\n• **Load Fees** - Sales charges (front-end or back-end)\n• **Transaction Costs** - Trading expenses\n• **Tax Costs** - Capital gains distributions\n\n**Impact of Costs:**\n• 1% higher expense ratio = ~20% lower returns over 30 years\n• Look for funds with expense ratios under 0.5%\n• Consider tax-efficient funds for taxable accounts\n• No-load funds avoid sales charges' 
      },
      { 
        title: 'Building a Mutual Fund Portfolio', 
        content: 'Create a diversified mutual fund portfolio based on your goals.\n\n**Portfolio Construction:**\n• **Core Holdings** - Broad market index funds (60-70%)\n• **Satellite Holdings** - Sector or theme funds (20-30%)\n• **International Exposure** - Global funds (10-20%)\n• **Bond Allocation** - Based on age and risk tolerance\n\n**Rebalancing Strategy:**\n• Review portfolio quarterly\n• Rebalance when allocations drift by 5%+\n• Use new contributions to rebalance\n• Consider tax implications when selling' 
      },
    ], 
  },
  { 
    id: 'taxsip', 
    title: 'Tax & SIP', 
    icon: '📋', 
    status: 'available',
    modules: [
      { 
        title: 'Advanced SIP Strategies', 
        content: 'Systematic Investment Plans can be optimized for better returns.\n\n**SIP Types:**\n• **Regular SIP** - Fixed amount monthly\n• **Step-up SIP** - Increase amount annually\n• **Flexible SIP** - Variable amounts based on market\n• **Trigger SIP** - Invest when market conditions are met\n\n**Optimization Strategies:**\n• Increase SIP amount by 10% yearly (step-up)\n• Invest more during market corrections\n• Use multiple SIPs for different goals\n• Consider direct plans for lower costs' 
      },
      { 
        title: 'Tax-Efficient Investing', 
        content: 'Minimize taxes to maximize your investment returns.\n\n**Tax-Advantaged Accounts:**\n• **401(k)** - Pre-tax contributions, tax-deferred growth\n• **Roth IRA** - Post-tax contributions, tax-free growth\n• **Traditional IRA** - Tax-deductible contributions\n• **HSAs** - Triple tax advantage for medical expenses\n\n**Tax Loss Harvesting:**\n• Sell losing investments to offset gains\n• Wait 30 days to avoid wash sale rule\n• Reinvest in similar but not identical securities\n• Can offset up to $3,000 in ordinary income' 
      },
      { 
        title: 'Capital Gains Tax Planning', 
        content: 'Understanding capital gains taxes is essential for investors.\n\n**Short-term vs Long-term:**\n• **Short-term** - Held < 1 year, taxed as ordinary income\n• **Long-term** - Held > 1 year, preferential rates (0%, 15%, 20%)\n\n**Tax Rates (2024):**\n• 0% for income up to $44,625 (single)\n• 15% for income $44,626-$492,300\n• 20% for income above $492,300\n• Additional 3.8% Net Investment Income Tax\n\n**Strategies:**\n• Hold investments > 1 year when possible\n• Consider tax-loss harvesting\n• Donate appreciated securities to charity\n• Use tax-efficient index funds' 
      },
      { 
        title: 'Retirement Tax Planning', 
        content: 'Optimize your retirement withdrawals for tax efficiency.\n\n**Withdrawal Strategies:**\n• **Traditional 401(k)/IRA)** - Taxed as ordinary income\n• **Roth Accounts** - Tax-free withdrawals\n• **Taxable Accounts** - Capital gains rates\n• **HSAs** - Tax-free for medical expenses\n\n**Required Minimum Distributions (RMDs):**\n• Start at age 73 (as of 2023)\n• Calculated based on account balance and life expectancy\n• 50% penalty for missed RMDs\n• Consider Roth conversions before RMDs begin\n\n**Social Security Taxation:**\n• 0-85% taxable based on other income\n• Plan withdrawals to minimize taxation\n• Consider state tax implications' 
      },
    ], 
  },
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
                    <span className="tag tag-gold">?? Locked</span>
                  ) : (
                    <span className="tag tag-green">??</span>
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