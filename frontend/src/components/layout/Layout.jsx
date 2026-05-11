import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Map, Bell, User } from 'lucide-react';
import './layout.css';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="layout-container">
      <header className="header shadow-sm">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">🚨</span>
            <span className="brand-text">RoadSOS</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="top-nav">
            <Link to="/dashboard" className={`top-nav-item ${isActive('/dashboard')}`}>Nearby</Link>
            <Link to="/map" className={`top-nav-item ${isActive('/map')}`}>Map</Link>
            <Link to="/sos" className={`top-nav-item ${isActive('/sos')} text-accent font-bold`}>SOS</Link>
            <Link to="/offline" className={`top-nav-item ${isActive('/offline')}`}>Offline</Link>
            <Link to="/profile" className={`top-nav-item ${isActive('/profile')}`}>Profile</Link>
            <Link to="/admin" className={`top-nav-item ${isActive('/admin')}`}>Admin</Link>
          </nav>

          <div className="header-actions">
            <button className="lang-switcher">EN</button>
            <div className="user-icon">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav shadow-lg">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          <Home size={24} />
          <span>Nearby</span>
        </Link>
        <Link to="/map" className={`nav-item ${isActive('/map')}`}>
          <Map size={24} />
          <span>Map</span>
        </Link>
        <Link to="/sos" className="nav-item sos-item">
          <div className="sos-btn-wrapper pulse-red">
            <Bell size={28} color="white" />
          </div>
        </Link>
        <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
          <User size={24} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
