import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navItems = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  { 
    path: '/portfolio', 
    label: 'Portfolio', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18"/>
        <path d="M18 17V9"/>
        <path d="M13 17V5"/>
        <path d="M8 17v-3"/>
      </svg>
    )
  },
  { 
    path: '/recommendations', 
    label: 'Explore', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    )
  },
  { 
    path: '/news', 
    label: 'News', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/>
      </svg>
    )
  },
  { 
    path: '/learn', 
    label: 'Learn', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    )
  },
  { 
    path: '/profile', 
    label: 'Profile', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <span className="nav-logo">FinSphere</span>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      <nav className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <span className="nav-logo">Fin<span>Sphere</span></span>
          <p className="nav-tagline">Smarter decisions. Better finance.</p>
        </div>

        <div className="nav-user">
          <div className="nav-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="nav-user-name">{user?.name}</p>
            <p className="nav-balance">${Number(user?.virtualBalance || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <ul className="nav-links">
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-item ${pathname === path ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button className="nav-logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </nav>
    </>
  );
};

export default Navbar;