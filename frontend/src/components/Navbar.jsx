import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⬛' },
  { path: '/portfolio', label: 'Portfolio', icon: '📊' },
  { path: '/recommendations', label: 'Explore', icon: '🔍' },
  { path: '/news', label: 'News', icon: '📰' },
  { path: '/learn', label: 'Learn', icon: '📚' },
  { path: '/profile', label: 'Profile', icon: '👤' },
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
          {mobileOpen ? '✕' : '☰'}
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
            <p className="nav-balance">₹{Number(user?.virtualBalance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
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
          <span>⏏</span> Logout
        </button>
      </nav>
    </>
  );
};

export default Navbar;