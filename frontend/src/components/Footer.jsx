import React, { useState } from 'react';

const modalContent = {
  about: {
    title: 'About FinSphere',
    content: (
      <>
        <p>FinSphere is a student-focused paper trading and financial literacy platform built to help beginners understand investing without risking real money.</p>
        <p>With FinSphere, you can explore real stock data, simulate trades with virtual currency, and learn the fundamentals of personal finance — all in one place.</p>
        <p>Built as a Web Technology project by <strong>Siddharth Kumar</strong> and <strong>Dhananjay Tiwari</strong>.</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <>
        <p><strong>Data We Collect:</strong> We collect your name, email address, and any profile information you voluntarily provide.</p>
        <p><strong>How We Use It:</strong> Your data is used solely to operate your FinSphere account — portfolio tracking, trade history, and personalization.</p>
        <p><strong>We Do Not:</strong> Sell your data, share it with third parties, or use it for advertising purposes.</p>
        <p><strong>Security:</strong> Passwords are hashed using bcrypt. We use JWT tokens for secure session management.</p>
        <p><strong>Contact:</strong> For any privacy concerns, reach out to the development team.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Use',
    content: (
      <>
        <p><strong>Educational Purpose Only:</strong> FinSphere is a paper trading simulation platform intended purely for learning. No real money is involved.</p>
        <p><strong>Not Financial Advice:</strong> Nothing on FinSphere constitutes real financial advice. Do not make real investment decisions based on this platform.</p>
        <p><strong>Acceptable Use:</strong> You agree not to misuse the platform, attempt to breach security, or use it for any unlawful purpose.</p>
        <p><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your login credentials.</p>
        <p><strong>Changes:</strong> We reserve the right to update these terms at any time.</p>
      </>
    ),
  },
  disclaimer: {
    title: 'Disclaimer',
    content: (
      <>
        <p><strong>No Real Money:</strong> All trades on FinSphere use virtual currency. No real financial transactions occur.</p>
        <p><strong>Stock Data:</strong> Stock prices and market data are sourced from third-party APIs (Finnhub) and may be delayed or inaccurate. Do not rely on this data for real trading decisions.</p>
        <p><strong>No Liability:</strong> The creators of FinSphere are not liable for any financial decisions made based on information viewed on this platform.</p>
        <p><strong>Academic Project:</strong> This platform was built as a college Web Technology project and is not a registered financial service.</p>
      </>
    ),
  },
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const modal = activeModal ? modalContent[activeModal] : null;

  return (
    <>
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
        fontSize: '13px',
        marginTop: 'auto',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <span>© 2025 FinSphere · Built by Siddharth Kumar & Dhananjay Tiwari</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['about', 'privacy', 'terms', 'disclaimer'].map((key) => (
            <button
              key={key}
              onClick={() => openModal(key)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                padding: 0,
                textTransform: 'capitalize',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </footer>

      {/* Modal Overlay */}
      {modal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '36px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute', top: '16px', right: '20px',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '22px',
                cursor: 'pointer', lineHeight: 1,
              }}
            >×</button>

            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px', fontSize: '20px' }}>
              {modal.title}
            </h2>

            <div style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {modal.content}
            </div>

            <button
              onClick={closeModal}
              style={{
                marginTop: '28px',
                background: 'var(--accent-gold)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;