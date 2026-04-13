import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  { icon: '1.', title: 'Paper Trading', desc: 'Trade with $100,000 virtual money. No real risk, real experience.' },
  { icon: '2.', title: 'Live Analytics', desc: 'Real-time portfolio performance, sector exposure and P&L tracking.' },
  { icon: '3.', title: 'AI Insights', desc: 'Get personalized investment insights based on your portfolio.' },
  { icon: '4.', title: 'Market News', desc: 'Stay updated with curated financial news and sentiment analysis.' },
  { icon: '5.', title: 'Learn Finance', desc: 'Structured learning tracks from basics to advanced investing.' },
  { icon: '6.', title: 'Recommendations', desc: 'Discover investment ideas tailored to your risk profile.' },
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

/* ── Revolut-style scroll morph cards ── */
const morphCards = [
  {
    id: 'trade',
    label: 'Trade',
    heading: 'Invest with confidence',
    sub: 'Execute trades on 500+ symbols with real-time quotes and zero commission.',
    accent: '#D4AF37',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="4,36 16,22 26,28 44,10" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="34,10 44,10 44,20" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="22" r="3" fill="#D4AF37" opacity="0.5"/>
        <circle cx="26" cy="28" r="3" fill="#D4AF37" opacity="0.5"/>
        <circle cx="44" cy="10" r="3" fill="#D4AF37"/>
      </svg>
    ),
  },
  {
    id: 'grow',
    label: 'Grow',
    heading: 'Watch your money work',
    sub: 'Portfolio compounding visualised. See how time and consistency multiply wealth.',
    accent: '#6366f1',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="28" width="8" height="14" rx="2" fill="#6366f1" opacity="0.7"/>
        <rect x="20" y="18" width="8" height="24" rx="2" fill="#6366f1" opacity="0.85"/>
        <rect x="34" y="8"  width="8" height="34" rx="2" fill="#6366f1"/>
        <path d="M8 26 L22 16 L36 6" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'learn',
    label: 'Learn',
    heading: 'Master the market',
    sub: 'Bite-sized finance lessons, from P/E ratios to portfolio diversification.',
    accent: '#34d399',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6 L44 16 L24 26 L4 16 Z" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" fill="rgba(52,211,153,0.1)"/>
        <path d="M44 16 L44 28" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 20 L8 34 Q8 42 24 42 Q40 42 40 34 L40 20" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
];

/* ── The morph section component ── */
function MorphSection() {
  const sectionRef = useRef(null);
  const heroImgRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | entering | morphed
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Trigger animation when section is 30% visible
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 'idle') {
          setPhase('entering');
          // After the big image finishes its entrance, begin morph
          setTimeout(() => setPhase('morphed'), 900);
        }
      },
      { threshold: 0.28 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [phase]);

  return (
    <section className="morph-section" ref={sectionRef}>
      {/* Ambient glow */}
      <div className="morph-bg-glow" />

      {/* Section label */}
      <div className={`morph-eyebrow ${phase !== 'idle' ? 'morph-eyebrow--visible' : ''}`}>
        <span>Platform capabilities</span>
      </div>

      <h2 className={`morph-heading ${phase !== 'idle' ? 'morph-heading--visible' : ''}`}>
        One platform.<br />Every money move.
      </h2>

      {/* The stage: big image + 3 cards */}
      <div className="morph-stage">

        {/* Hero image — shrinks into card[0] slot on morph */}
        <div
          ref={heroImgRef}
          className={`morph-hero-img
            ${phase === 'entering' ? 'morph-hero-img--entering' : ''}
            ${phase === 'morphed'  ? 'morph-hero-img--morphed'  : ''}
          `}
        >
          {/* SVG illustration: money / trading dashboard feel */}
          <div className="morph-img-inner">
            <MoneySVG />
            <div className="morph-img-overlay" />
          </div>
        </div>

        {/* Three cards */}
        <div className="morph-cards">
          {morphCards.map((card, i) => (
            <div
              key={card.id}
              className={`morph-card
                ${phase === 'morphed' ? 'morph-card--visible' : ''}
                ${i === 0 ? 'morph-card--first' : ''}
                ${activeCard === card.id ? 'morph-card--active' : ''}
              `}
              style={{ '--card-delay': `${i * 120}ms`, '--card-accent': card.accent }}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Card image area */}
              <div className="morph-card-visual">
                <div className="morph-card-icon">{card.icon}</div>
                {/* Mini sparkline / decoration */}
                <div className="morph-card-deco">
                  <svg viewBox="0 0 120 40" fill="none">
                    <polyline
                      points={i === 0 ? "0,35 20,28 40,30 60,18 80,22 100,10 120,14"
                               : i === 1 ? "0,38 20,32 40,26 60,20 80,14 100,8 120,4"
                               : "0,30 20,34 40,20 60,24 80,16 100,20 120,12"}
                      stroke={card.accent}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </div>
              {/* Card text */}
              <div className="morph-card-body">
                <span className="morph-card-label">{card.label}</span>
                <h3 className="morph-card-heading">{card.heading}</h3>
                <p className="morph-card-sub">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Inline SVG: rich money / market illustration */
function MoneySVG() {
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="money-svg">
      {/* Background card */}
      <rect x="20" y="20" width="480" height="300" rx="20" fill="rgba(13,20,36,0.95)" stroke="rgba(212,175,55,0.15)" strokeWidth="1"/>

      {/* Dashboard header */}
      <rect x="40" y="40" width="200" height="8" rx="4" fill="rgba(255,255,255,0.08)"/>
      <rect x="40" y="56" width="120" height="6" rx="3" fill="rgba(255,255,255,0.05)"/>

      {/* Big number */}
      <text x="40" y="110" fontFamily="'SF Pro Display', sans-serif" fontSize="36" fontWeight="700" fill="#D4AF37">$124,830</text>
      <text x="40" y="132" fontFamily="sans-serif" fontSize="12" fill="rgba(255,255,255,0.4)">Portfolio value</text>

      {/* Up badge */}
      <rect x="40" y="146" width="70" height="22" rx="11" fill="rgba(52,211,153,0.12)"/>
      <text x="54" y="161" fontFamily="sans-serif" fontSize="11" fill="#34d399" fontWeight="600">▲ 6.4%</text>

      {/* Chart area */}
      <rect x="40" y="182" width="440" height="100" rx="10" fill="rgba(255,255,255,0.02)"/>

      {/* Area fill */}
      <path
        d="M50 262 C80 250, 100 240, 130 235 S180 220, 210 215 S260 200, 290 190 S340 178, 370 172 S420 162, 460 155 L460 272 L50 272 Z"
        fill="url(#areaGrad)"
        opacity="0.4"
      />
      {/* Line */}
      <path
        d="M50 262 C80 250, 100 240, 130 235 S180 220, 210 215 S260 200, 290 190 S340 178, 370 172 S420 162, 460 155"
        stroke="#D4AF37"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Dot at tip */}
      <circle cx="460" cy="155" r="5" fill="#D4AF37"/>
      <circle cx="460" cy="155" r="9" fill="#D4AF37" opacity="0.2"/>

      {/* X-axis labels */}
      {['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => (
        <text key={m} x={60 + i * 76} y="295" fontFamily="sans-serif" fontSize="10" fill="rgba(255,255,255,0.25)" textAnchor="middle">{m}</text>
      ))}

      {/* Right panel: holdings mini list */}
      <rect x="340" y="40" width="140" height="120" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      <text x="355" y="62" fontFamily="sans-serif" fontSize="10" fill="rgba(255,255,255,0.35)" fontWeight="600" letterSpacing="1">HOLDINGS</text>
      {[
        { sym: 'RELIANCE', chg: '+2.1%', clr: '#34d399' },
        { sym: 'TCS',      chg: '+1.4%', clr: '#34d399' },
        { sym: 'INFY',     chg: '-0.6%', clr: '#f87171' },
        { sym: 'HDFC',     chg: '+3.2%', clr: '#34d399' },
      ].map((s, i) => (
        <g key={s.sym}>
          <text x="355" y={83 + i * 20} fontFamily="sans-serif" fontSize="10" fill="rgba(255,255,255,0.6)" fontWeight="500">{s.sym}</text>
          <text x="468" y={83 + i * 20} fontFamily="sans-serif" fontSize="10" fill={s.clr} textAnchor="end">{s.chg}</text>
        </g>
      ))}

      {/* Gradient def */}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

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
          <div className="hero-badge">Advanced Paper Trading Platform</div>
          <h1>Smarter Portfolio Intelligence<br />for Better Decisions</h1>
          <p>Track, analyze, and understand your investments using data-driven insights. Start with $100,000 virtual money — zero risk, real learning.</p>
          <div className="hero-cta">
            <Link to="/auth?mode=register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/auth" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>$0</span><p>Real Risk</p></div>
          <div className="stat"><span>∞</span><p>Learning</p></div>
          <div className="stat"><span>Live</span><p>Market Data</p></div>
        </div>
      </section>

      {/* ✦ NEW: Revolut-style morph section */}
      <MorphSection />

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