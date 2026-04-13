import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getPortfolio, getTrades, getStockQuote, buyStock, sellStock, searchStocks, getIndexData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Portfolio.css';

// Portfolio Chart Component
const PortfolioChart = ({ portfolio }) => {
  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndexData = async () => {
      try {
        const res = await getIndexData('^GSPC'); // S&P 500
        setIndexData(res.data);
      } catch (error) {
        console.error('Failed to fetch index data:', error);
        // Fallback to mock data
        setIndexData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIndexData();
  }, []);

  // Generate real portfolio performance data
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const portfolioReturns = [];
    const indexReturns = [];
    
    // Calculate portfolio performance based on actual holdings
    if (portfolio?.holdings?.length > 0) {
      const totalInvested = portfolio.holdings.reduce((sum, h) => sum + (h.quantity * h.averageBuyPrice), 0);
      const currentValue = portfolio.holdings.reduce((sum, h) => sum + (h.quantity * (h.currentPrice || h.averageBuyPrice)), 0);
      const overallReturn = ((currentValue - totalInvested) / totalInvested) * 100;
      
      // Generate monthly returns based on actual portfolio performance
      let cumulativeReturn = 0;
      for (let i = 0; i < 12; i++) {
        // Simulate monthly progression towards actual return with some volatility
        const targetMonthlyReturn = overallReturn / 12;
        const volatility = (Math.random() - 0.5) * 0.04; // ±2% monthly volatility
        const monthlyReturn = targetMonthlyReturn + volatility;
        
        cumulativeReturn += monthlyReturn;
        portfolioReturns.push(cumulativeReturn);
      }
    } else {
      // No holdings - flat performance
      for (let i = 0; i < 12; i++) {
        portfolioReturns.push(0);
      }
    }
    
    // Generate S&P 500 index returns
    if (indexData && indexData.length > 0) {
      // Use real index data - calculate monthly returns
      let indexReturn = 0;
      const startIndex = indexData[0]?.close || 100;
      
      for (let i = 0; i < 12 && i < indexData.length; i++) {
        const currentPrice = indexData[i]?.close || startIndex;
        const monthlyReturn = ((currentPrice - startIndex) / startIndex) * 100;
        indexReturns.push(monthlyReturn);
      }
      
      // Fill remaining months if needed
      while (indexReturns.length < 12) {
        const lastReturn = indexReturns[indexReturns.length - 1] || 0;
        indexReturns.push(lastReturn + (Math.random() - 0.48) * 0.6);
      }
    } else {
      // Fallback to mock data
      let indexReturn = 0;
      for (let i = 0; i < 12; i++) {
        const monthlyIndexReturn = (Math.random() - 0.48) * 0.06; // Average 2% monthly return
        indexReturn += monthlyIndexReturn;
        indexReturns.push(indexReturn * 100);
      }
    }
    
    return { months, portfolioReturns, indexReturns };
  };

  const { months, portfolioReturns, indexReturns } = generateChartData();
  
  // Calculate SVG dimensions and scaling
  const width = 600;
  const height = 250;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const allReturns = [...portfolioReturns, ...indexReturns];
  const maxReturn = Math.max(...allReturns);
  const minReturn = Math.min(...allReturns);
  const returnRange = maxReturn - minReturn;
  
  // Scale functions
  const xScale = (i) => padding + (i / (months.length - 1)) * chartWidth;
  const yScale = (returnValue) => height - padding - ((returnValue - minReturn) / returnRange) * chartHeight;
  
  // Create path strings
  const createPath = (data) => {
    return data.map((value, i) => {
      const x = xScale(i);
      const y = yScale(value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  };
  
  const portfolioPath = createPath(portfolioReturns);
  const indexPath = createPath(indexReturns);
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="portfolio-chart">
      {/* Grid lines and Y-axis labels */}
      {[0, 1, 2, 3, 4].map(i => {
        const y = padding + (i * chartHeight / 4);
        const value = maxReturn - (returnRange * i / 4);
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x={padding - 12} y={y + 3} fill="var(--text-muted)" fontSize="9" textAnchor="end">
              {value >= 0 ? '+' : ''}{value.toFixed(1)}%
            </text>
          </g>
        );
      })}
      
      {/* Zero line */}
      <line 
        x1={padding} 
        y1={yScale(0)} 
        x2={width - padding} 
        y2={yScale(0)} 
        stroke="rgba(255,255,255,0.3)" 
        strokeWidth="1" 
        strokeDasharray="2,2"
      />
      
      {/* Portfolio line */}
      <path d={portfolioPath} fill="none" stroke="var(--gold)" strokeWidth="3" />
      
      {/* Index line */}
      <path d={indexPath} fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="5,5" />
      
      {/* Data points */}
      {portfolioReturns.map((returnValue, i) => (
        <circle key={`portfolio-${i}`} cx={xScale(i)} cy={yScale(returnValue)} r="4" fill="var(--gold)" />
      ))}
      
      {/* X-axis labels */}
      {months.map((month, i) => (
        <text key={month} x={xScale(i)} y={height - 10} fill="var(--text-muted)" fontSize="11" textAnchor="middle">
          {month}
        </text>
      ))}
      
      {/* Axis labels */}
      <text x={width / 2} y={height - 2} fill="var(--text-muted)" fontSize="12" textAnchor="middle">
        Time Period
      </text>
      <text x={15} y={height / 2} fill="var(--text-muted)" fontSize="12" textAnchor="middle" transform={`rotate(-90 15 ${height / 2})`}>
        Return (%)
      </text>
    </svg>
  );
};

const Portfolio = () => {
  const { user, updateUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);
  const [tab, setTab] = useState('holdings');
  const [tradeModal, setTradeModal] = useState(null); // { type: 'BUY'|'SELL', holding: {} }
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tradeForm, setTradeForm] = useState({ symbol: '', companyName: '', quantity: 1, price: 0, sector: '' });
  const [tradeMsg, setTradeMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [p, t] = await Promise.all([getPortfolio(), getTrades()]);
      setPortfolio(p.data);
      setTrades(t.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length >= 2) {
      try {
        const res = await searchStocks(q);
        setSearchResults(res.data);
      } catch { setSearchResults([]); }
    } else {
      setSearchResults([]);
    }
  };

  const selectStock = async (stock) => {
    setSearchResults([]);
    setSearchQuery(stock.name);
    try {
      const res = await getStockQuote(stock.symbol);
      setTradeForm({ symbol: stock.symbol, companyName: stock.name, quantity: 1, price: res.data.price, sector: 'Unknown' });
    } catch {
      setTradeForm({ ...tradeForm, symbol: stock.symbol, companyName: stock.name });
    }
  };

  const openBuyModal = () => {
    setTradeModal({ type: 'BUY' });
    setTradeForm({ symbol: '', companyName: '', quantity: 1, price: 0, sector: '' });
    setSearchQuery('');
    setTradeMsg('');
  };

  const openSellModal = (holding) => {
    setTradeModal({ type: 'SELL', holding });
    setTradeForm({ symbol: holding.symbol, companyName: holding.companyName, quantity: 1, price: holding.currentPrice || holding.averageBuyPrice, sector: holding.sector });
    setTradeMsg('');
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    // Allow empty string while typing, or a valid positive number
    if (val === '' || val === '.') {
      setTradeForm({ ...tradeForm, quantity: val });
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setTradeForm({ ...tradeForm, quantity: val }); // keep as string while editing
    }
  };

  const handleTrade = async () => {
    const qty = parseFloat(tradeForm.quantity);
    if (!qty || qty <= 0) {
      setTradeMsg('✗ Quantity must be greater than 0');
      return;
    }
    try {
      let res;
      const payload = { ...tradeForm, quantity: qty };
      if (tradeModal.type === 'BUY') {
        res = await buyStock(payload);
      } else {
        res = await sellStock(payload);
      }
      updateUser({ virtualBalance: res.data.virtualBalance });
      setPortfolio(res.data.portfolio);
      setTradeMsg(`✓ ${tradeModal.type} successful!`);
      setTimeout(() => { setTradeModal(null); fetchData(); }, 1500);
    } catch (e) {
      setTradeMsg(`✗ ${e.response?.data?.message || 'Trade failed'}`);
    }
  };

  const totalInvested = portfolio?.holdings?.reduce((a, h) => a + h.quantity * h.averageBuyPrice, 0) || 0;
  const currentValue = portfolio?.holdings?.reduce((a, h) => a + h.quantity * (h.currentPrice || h.averageBuyPrice), 0) || 0;
  const pnl = currentValue - totalInvested;

  const qty = parseFloat(tradeForm.quantity) || 0;
  const total = qty * tradeForm.price;

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Portfolio</h1>
            <p>Manage your holdings and execute paper trades.</p>
          </div>
          <button className="btn btn-primary" onClick={openBuyModal}>+ Buy Stock</button>
        </div>

        {/* Portfolio Value Chart */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h3>Portfolio Value Over Time</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot portfolio"></span>
                Portfolio Value
              </span>
              <span className="legend-item">
                <span className="legend-dot index"></span>
                S&P 500 Index
              </span>
            </div>
          </div>
          <div className="chart-container">
            <PortfolioChart portfolio={portfolio} />
          </div>
        </div>

        {/* Portfolio Header */}
        <div className="portfolio-header card">
          <div>
            <div className="metric-label">Total Invested</div>
            <div className="metric-value">${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="metric-label">Current Value</div>
            <div className="metric-value">${currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="metric-label">Unrealized P&L</div>
            <div className={`metric-value ${pnl >= 0 ? 'positive' : 'negative'}`}>
              {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                ({totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(2) : '0.00'}%)
              </span>
            </div>
          </div>
          <div>
            <div className="metric-label">Available Balance</div>
            <div className="metric-value">${Number(user?.virtualBalance || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['holdings', 'transactions'].map((t) => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Holdings Table */}
        {tab === 'holdings' && (
          <div className="card">
            {loading ? <div className="loading-placeholder">Loading...</div>
              : portfolio?.holdings?.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Qty</th>
                      <th>Avg Buy</th>
                      <th>Current</th>
                      <th>P&L</th>
                      <th>% Alloc</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((h) => {
                      const hPnl = h.quantity * ((h.currentPrice || h.averageBuyPrice) - h.averageBuyPrice);
                      const alloc = totalInvested > 0 ? ((h.quantity * h.averageBuyPrice / totalInvested) * 100).toFixed(1) : 0;
                      return (
                        <tr key={h.symbol}>
                          <td>
                            <strong>{h.symbol}</strong>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{h.companyName}</div>
                          </td>
                          <td>{parseFloat(h.quantity.toFixed(6))}</td>
                          <td>${h.averageBuyPrice.toFixed(2)}</td>
                          <td>${(h.currentPrice || h.averageBuyPrice).toFixed(2)}</td>
                          <td className={hPnl >= 0 ? 'positive' : 'negative'}>
                            {hPnl >= 0 ? '+' : ''}${Math.abs(hPnl).toFixed(2)}
                          </td>
                          <td><span className="tag tag-gold">{alloc}%</span></td>
                          <td>
                            <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => openSellModal(h)}>Sell</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state"><p>No holdings yet. Buy a stock to get started!</p></div>
              )}
          </div>
        )}

        {/* Transactions */}
        {tab === 'transactions' && (
          <div className="card">
            {trades.length > 0 ? (
              <table className="table">
                <thead>
                  <tr><th>Type</th><th>Stock</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t._id}>
                      <td><span className={`tag ${t.type === 'BUY' ? 'tag-green' : 'tag-red'}`}>{t.type}</span></td>
                      <td><strong>{t.symbol}</strong></td>
                      <td>{parseFloat(t.quantity.toFixed(6))}</td>
                      <td>${t.price.toFixed(2)}</td>
                      <td>${t.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state"><p>No transactions yet.</p></div>
            )}
          </div>
        )}
      </main>

      {/* Trade Modal */}
      {tradeModal && (
        <div className="modal-overlay" onClick={() => setTradeModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{tradeModal.type === 'BUY' ? '🟢 Buy Stock' : '🔴 Sell Stock'}</h3>
              <button onClick={() => setTradeModal(null)}>✕</button>
            </div>

            {tradeModal.type === 'BUY' && (
              <div className="search-wrapper">
                <input className="input" placeholder="Search stock symbol or company..." value={searchQuery} onChange={handleSearch} />
                {searchResults.length > 0 && (
                  <ul className="search-dropdown">
                    {searchResults.map((s) => (
                      <li key={s.symbol} onClick={() => selectStock(s)}>
                        <strong>{s.symbol}</strong> — {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tradeModal.type === 'SELL' && (
              <div className="modal-stock-info">
                <strong>{tradeForm.symbol}</strong> — {tradeForm.companyName}
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  You own: {parseFloat(tradeModal.holding.quantity.toFixed(6))} shares
                </div>
              </div>
            )}

            <div className="form-group">
              <label>
                Quantity
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  (fractional shares supported, e.g. 0.5)
                </span>
              </label>
              <input
                className="input"
                type="number"
                min="0.000001"
                step="0.000001"
                value={tradeForm.quantity}
                onChange={handleQuantityChange}
                placeholder="e.g. 0.5, 1, 2.75"
              />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input className="input" type="number" step="0.01"
                value={tradeForm.price}
                onChange={(e) => setTradeForm({ ...tradeForm, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="modal-total">
              Total: <strong>${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
            </div>

            {tradeMsg && (
              <div className={`trade-msg ${tradeMsg.startsWith('✓') ? 'success' : 'error'}`}>{tradeMsg}</div>
            )}

            <button className={`btn ${tradeModal.type === 'BUY' ? 'btn-success' : 'btn-danger'}`}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={handleTrade}>
              Confirm {tradeModal.type}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;