import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  { icon: '📊', title: 'Paper Trading', desc: 'Trade with ₹1,00,000 virtual money. No real risk, real experience.' },
  { icon: '📈', title: 'Live Analytics', desc: 'Real-time portfolio performance, sector exposure and P&L tracking.' },
  { icon: '🤖', title: 'AI Insights', desc: 'Get personalized investment insights based on your portfolio.' },
  { icon: '📰', title: 'Market News', desc: 'Stay updated with curated financial news and sentiment analysis.' },
  { icon: '📚', title: 'Learn Finance', desc: 'Structured learning tracks from basics to advanced investing.' },
  { icon: '🎯', title: 'Recommendations', desc: 'Discover investment ideas tailored to your risk profile.' },
];

const modalContent = {
  about: {
    title: 'About FinSphere',
    body: [
      'FinSphere is a student-focused paper trading and financial literacy platform built to help beginners understand investing without risking real money.',
      'Explore real stock data, simulate trades with virtual currency, and learn the fundamentals of personal finance — all in one place.',
      'Built as a Web Technology project by Siddharth Kumar and Dhananjay Tiwari.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'Data We Collect: We collect your name, email address, and any profile information you voluntarily provide.',
      'How We Use It: Your data is used solely to operate your FinSphere account — portfolio tracking, trade history, and personalization.',
      'We Do Not: Sell your data, share it with third parties, or use it for advertising purposes.',
      'Security: Passwords are hashed using bcrypt. We use JWT tokens for secure session management.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    body: [
      'Educational Purpose Only: FinSphere is a paper trading simulation platform intended purely for learning. No real money is involved.',
      'Not Financial Advice: Nothing on FinSphere constitutes real financial advice. Do not make real investment decisions based on this platform.',
      'Acceptable Use: You agree not to misuse the platform, attempt to breach security, or use it for any unlawful purpose.',
      'Account Responsibility: You are responsible for maintaining the confidentiality of your login credentials.',
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    body: [
      'No Real Money: All trades on FinSphere use virtual currency. No real financial transactions occur.',
      'Stock Data: Stock prices and market data are sourced from third-party APIs (Finnhub) and may be delayed or inaccurate.',
      'No Liability: The creators of FinSphere are not liable for any financial decisions made based on information viewed on this platform.',
      'Academic Project: This platform was built as a college Web Technology project and is not a registered financial service.',
    ],
  },
};

const testimonials = [
  { text: '"Helped me understand investing without risking real money."', name: 'Rohan S., 2nd Year Engineering' },
  { text: '"The learning modules are clear and actually useful."', name: 'Priya M., Finance Student' },
  { text: '"Finally a platform that doesn\'t overwhelm beginners."', name: 'Aarav K., MBA Aspirant' },
];

const Home = () => {
  const [activeModal, setActiveModal] = useState(null);
  return (
    <div className="home">
      {/* Navbar */}
      <header className="home-header">
        <span className="home-logo">Fin<span>Sphere</span></span>
        <div className="home-header-actions">
          <Link to="/auth" className="btn btn-secondary">Sign In</Link>
          <Link to="/auth?mode=register" className="btn btn-primary">Sign Up Free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">🚀 Paper Trading Platform</div>
          <h1>Smarter Portfolio Intelligence<br />for Better Decisions</h1>
          <p>Track, analyze, and understand your investments using data-driven insights. Start with ₹1,00,000 virtual money — zero risk, real learning.</p>
          <div className="hero-cta">
            <Link to="/auth?mode=register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/auth" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>₹0</span><p>Real Risk</p></div>
          <div className="stat"><span>∞</span><p>Learning</p></div>
          <div className="stat"><span>Live</span><p>Market Data</p></div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Everything you need to learn investing</h2>
        <p className="section-sub">One integrated platform for paper trading, analytics, news and financial education.</p>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What students are saying</h2>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p>{t.text}</p>
              <span>— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <h2>Start understanding your money today</h2>
        <p>Join thousands of students building financial literacy with FinSphere.</p>
        <Link to="/auth?mode=register" className="btn btn-primary">Get Started →</Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <span>© 2025 FinSphere · Built by Siddharth Kumar & Dhananjay Tiwari</span>
        <div className="footer-links">
          {['about', 'privacy', 'terms', 'disclaimer'].map((key) => (
            <button
              key={key}
              onClick={() => setActiveModal(key)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </footer>

      {/* Modal */}
      {activeModal && (
        <div onClick={() => setActiveModal(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '36px', maxWidth: '540px', width: '100%',
            maxHeight: '80vh', overflowY: 'auto', position: 'relative',
          }}>
            <button onClick={() => setActiveModal(null)} style={{
              position: 'absolute', top: '16px', right: '20px',
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '22px', cursor: 'pointer',
            }}>×</button>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px', fontSize: '20px' }}>
              {modalContent[activeModal].title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modalContent[activeModal].body.map((para, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px', margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} style={{
              marginTop: '28px', background: 'var(--accent-gold)', color: '#000',
              border: 'none', borderRadius: '8px', padding: '10px 24px',
              fontWeight: '600', cursor: 'pointer', fontSize: '14px',
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;