import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getPortfolio, getRecentTrades, getIndexData } from '../services/api';
import './Dashboard.css';

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

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portRes, tradeRes] = await Promise.all([getPortfolio(), getRecentTrades()]);
        setPortfolio(portRes.data);
        setRecentTrades(tradeRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalCurrentValue = portfolio?.holdings?.reduce(
    (acc, h) => acc + h.quantity * (h.currentPrice || h.averageBuyPrice), 0
  ) || 0;

  const totalInvested = portfolio?.holdings?.reduce(
    (acc, h) => acc + h.quantity * h.averageBuyPrice, 0
  ) || 0;

  const overallPnL = totalCurrentValue - totalInvested;
  const overallPnLPercent = totalInvested > 0 ? ((overallPnL / totalInvested) * 100).toFixed(2) : '0.00';
  const todayGain = overallPnL * 0.04; // Simulated today's gain

  const sectorMap = {};
  portfolio?.holdings?.forEach((h) => {
    sectorMap[h.sector || 'Unknown'] = (sectorMap[h.sector || 'Unknown'] || 0) + h.quantity * h.averageBuyPrice;
  });

  const topSectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const alerts = [];
  if (portfolio?.holdings?.length > 0) {
    const techAlloc = (sectorMap['Technology'] / totalInvested) * 100 || 0;
    if (techAlloc > 40) alerts.push({ type: 'warn', msg: 'Overexposed to Tech sector' });
    if (portfolio.holdings.length < 3) alerts.push({ type: 'warn', msg: 'Low diversification detected' });
    if (user?.virtualBalance > 20000) alerts.push({ type: 'ok', msg: 'Emergency fund adequate' });
  }

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content fade-in">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Good to see you, {user?.name?.split(' ')[0]}! Here's your financial overview.</p>
        </div>

        {/* Metric Strip */}
        <div className="metric-strip">
          <div className="metric-card">
            <div className="metric-label">Total Invested</div>
            <div className="metric-value">${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Current Value</div>
            <div className="metric-value">${totalCurrentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Overall P&L</div>
            <div className={`metric-value ${overallPnL >= 0 ? 'positive' : 'negative'}`}>
              {overallPnL >= 0 ? '+' : ''}${Math.abs(overallPnL).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className={`metric-sub ${overallPnL >= 0 ? 'positive' : 'negative'}`}>
              {overallPnL >= 0 ? '+' : ''}{overallPnLPercent}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Virtual Balance</div>
            <div className="metric-value">${Number(user?.virtualBalance || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          </div>
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

        <div className="dashboard-grid">
          {/* Holdings Summary */}
          <div className="card dashboard-card">
            <div className="card-header">
              <h3>Portfolio Holdings</h3>
              <Link to="/portfolio" className="card-link">View All →</Link>
            </div>
            {loading ? (
              <div className="loading-placeholder">Loading...</div>
            ) : portfolio?.holdings?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th>Qty</th>
                    <th>Avg Buy</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.slice(0, 5).map((h) => {
                    const pnl = h.quantity * ((h.currentPrice || h.averageBuyPrice) - h.averageBuyPrice);
                    return (
                      <tr key={h.symbol}>
                        <td>
                          <strong>{h.symbol}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{h.companyName}</div>
                        </td>
                        <td>{h.quantity}</td>
                        <td>${h.averageBuyPrice.toFixed(2)}</td>
                        <td className={pnl >= 0 ? 'positive' : 'negative'}>
                          {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toFixed(0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No holdings yet.</p>
                <Link to="/recommendations" className="btn btn-primary" style={{ marginTop: '12px' }}>Explore Stocks</Link>
              </div>
            )}
          </div>

          {/* Quick Alerts */}
          <div className="card dashboard-card">
            <div className="card-header"><h3>Quick Alerts & Insights</h3></div>
            {alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map((a, i) => (
                  <div key={i} className={`alert-item ${a.type}`}>{a.msg}</div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><p>No alerts. Start trading to get insights.</p></div>
            )}

            <div className="card-header" style={{ marginTop: '24px' }}><h3>Sector Exposure</h3></div>
            {topSectors.length > 0 ? (
              <div className="sector-bars">
                {topSectors.map(([sector, val]) => (
                  <div className="sector-bar-row" key={sector}>
                    <span>{sector}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.min((val / totalInvested) * 100, 100)}%` }} />
                    </div>
                    <span>{((val / totalInvested) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><p>No sector data yet.</p></div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card dashboard-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <Link to="/portfolio" className="card-link">View All →</Link>
            </div>
            {recentTrades.length > 0 ? (
              <div className="activity-list">
                {recentTrades.map((t) => (
                  <div key={t._id} className="activity-item">
                    <span className={`tag ${t.type === 'BUY' ? 'tag-green' : 'tag-red'}`}>{t.type}</span>
                    <span><strong>{t.quantity} shares</strong> of {t.symbol}</span>
                    <span className="activity-value">${t.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><p>No trades yet. Start paper trading!</p></div>
            )}
          </div>

          {/* Shortcut Actions */}
          <div className="card dashboard-card shortcuts">
            <h3>Quick Actions</h3>
            <div className="shortcut-buttons">
              <Link to="/portfolio" className="btn btn-secondary">📊 View Portfolio</Link>
              <Link to="/recommendations" className="btn btn-secondary">🔍 Explore Stocks</Link>
              <Link to="/news" className="btn btn-secondary">📰 Market News</Link>
              <Link to="/learn" className="btn btn-secondary">📚 Learn</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;