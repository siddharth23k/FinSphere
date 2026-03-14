import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getNews } from '../services/api';
import './News.css';

const CATEGORIES = ['All', 'Markets', 'Stocks', 'Economy', 'Crypto'];

const CATEGORY_KEYWORDS = {
  Markets: ['market', 'index', 'nifty', 'sensex', 'nasdaq', 'dow', 's&p', 'wall street', 'rally', 'sell-off', 'trading', 'forex', 'crude', 'oil', 'gold', 'commodit'],
  Stocks: ['stock', 'share', 'equity', 'ipo', 'earning', 'dividend', 'buyback', 'quarter', 'profit', 'revenue', 'loss', 'company', 'corp', 'inc', 'ltd', 'apple', 'tesla', 'google', 'amazon', 'nvidia', 'microsoft'],
  Economy: ['economy', 'economic', 'gdp', 'inflation', 'interest rate', 'fed', 'rbi', 'central bank', 'recession', 'employment', 'jobs', 'fiscal', 'policy', 'budget', 'trade', 'export', 'import', 'tariff', 'sanctions'],
  Crypto: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'btc', 'eth', 'defi', 'nft', 'token', 'coinbase', 'binance', 'web3', 'altcoin', 'stablecoin'],
};

const matchesCategory = (item, category) => {
  if (category === 'All') return true;
  const keywords = CATEGORY_KEYWORDS[category] || [];
  const text = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
};

const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s*[-–|]\s*(Reuters|Bloomberg|CNBC|AP|AFP|BBC|WSJ|FT|Forbes|MarketWatch)\.?\s*$/i, '')
    .replace(/\s*(Reuters|Bloomberg|CNBC|AP|AFP|BBC|WSJ|FT|Forbes|MarketWatch)\.?\s*$/i, '')
    .trim();
};

const News = () => {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNews();
        setNews(res.data);
      } catch {
        setError('Could not load news. Check your API key or try again later.');
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => matchesCategory(item, filter));

  const getSentimentClass = (s) => {
    if (!s) return '';
    if (s.includes('Bullish') || s.includes('Positive')) return 'tag-green';
    if (s.includes('Bearish') || s.includes('Negative')) return 'tag-red';
    return 'tag-gold';
  };

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content fade-in">
        <div className="page-header">
          <h1>Market News</h1>
          <p>Stay updated with the latest financial news and market sentiment.</p>
        </div>

        {/* Filter Bar */}
        <div className="news-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-btn ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
              {c !== 'All' && news.length > 0 && (
                <span style={{
                  marginLeft: '6px', fontSize: '11px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '1px 6px',
                }}>
                  {news.filter((item) => matchesCategory(item, c)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && <div className="loading-placeholder">Loading news...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="empty-state" style={{ marginTop: '40px' }}>
            <p>No {filter} news found in the current feed.</p>
          </div>
        )}

        {!loading && !error && filteredNews.length > 0 && (
          <div className="news-layout">
            {/* Featured */}
            {filteredNews[0] && (
              <a href={filteredNews[0].url} target="_blank" rel="noreferrer" className="news-featured card">
                {filteredNews[0].image && (
                  <img src={filteredNews[0].image} alt="" className="featured-img" />
                )}
                <div className="featured-content">
                  <div className="news-meta">
                    <span className="news-source">{filteredNews[0].source}</span>
                    {filteredNews[0].sentiment && (
                      <span className={`tag ${getSentimentClass(filteredNews[0].sentiment)}`}>
                        {filteredNews[0].sentiment}
                      </span>
                    )}
                  </div>
                  <h2>{cleanText(filteredNews[0].title)}</h2>
                  <p>{cleanText(filteredNews[0].summary).slice(0, 200)}...</p>
                </div>
              </a>
            )}

            <div className="news-grid">
              {filteredNews.slice(1).map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noreferrer" className="news-card card">
                  <div className="news-meta">
                    <span className="news-source">{item.source}</span>
                    {item.sentiment && (
                      <span className={`tag ${getSentimentClass(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    )}
                  </div>
                  <h4>{cleanText(item.title)}</h4>
                  <p>{cleanText(item.summary).slice(0, 120)}...</p>
                  <div className="news-time">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN') : ''}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default News;