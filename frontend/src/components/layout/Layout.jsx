import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Map, Bell, User } from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';
import { useTranslation } from '../../context/LanguageContext';
import './layout.css';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const { t } = useTranslation();

  return (
    <div className="layout-container">
      <header className="header shadow-sm">
        <div className="container header-inner">
          <Link to="/home" className="brand">
            <span className="brand-icon">🚨</span>
            <span className="brand-text">RoadSOS</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="top-nav">
            <Link to="/dashboard" className={`top-nav-item ${isActive('/dashboard')}`}>{t('navNearby')}</Link>
            <Link to="/map" className={`top-nav-item ${isActive('/map')}`}>{t('navMap')}</Link>
            <Link to="/sos" className={`top-nav-item ${isActive('/sos')} text-accent font-bold`}>{t('navSOS')}</Link>
            <Link to="/offline" className={`top-nav-item ${isActive('/offline')}`}>{t('navOffline')}</Link>
            <Link to="/profile" className={`top-nav-item ${isActive('/profile')}`}>{t('navProfile')}</Link>
            <Link to="/admin" className={`top-nav-item ${isActive('/admin')}`}>{t('navAdmin')}</Link>
          </nav>

          <div className="header-actions">
            <LanguageSelector />
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
