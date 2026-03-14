import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getPortfolio, getRecentTrades } from '../services/api';
import './Dashboard.css';

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
    if (techAlloc > 40) alerts.push({ type: 'warn', msg: '⚠ Overexposed to Tech sector' });
    if (portfolio.holdings.length < 3) alerts.push({ type: 'warn', msg: '⚠ Low diversification detected' });
    if (user?.virtualBalance > 20000) alerts.push({ type: 'ok', msg: '✓ Emergency fund adequate' });
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
            <div className="metric-value">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Current Value</div>
            <div className="metric-value">₹{totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Overall P&L</div>
            <div className={`metric-value ${overallPnL >= 0 ? 'positive' : 'negative'}`}>
              {overallPnL >= 0 ? '+' : ''}₹{Math.abs(overallPnL).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className={`metric-sub ${overallPnL >= 0 ? 'positive' : 'negative'}`}>
              {overallPnL >= 0 ? '+' : ''}{overallPnLPercent}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Virtual Balance</div>
            <div className="metric-value">₹{Number(user?.virtualBalance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
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
                        <td>₹{h.averageBuyPrice.toFixed(2)}</td>
                        <td className={pnl >= 0 ? 'positive' : 'negative'}>
                          {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toFixed(0)}
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
                    <span className="activity-value">₹{t.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
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