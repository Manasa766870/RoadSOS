import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { ShieldAlert, Globe, Clock, ShieldCheck } from 'lucide-react';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header px-4">
        <div className="brand">
          <ShieldAlert color="#ef4444" size={28} />
          <span className="brand-text text-xl ml-2">RoadSOS</span>
        </div>
        <button className="lang-switcher flex items-center">
          <Globe size={18} className="mr-1" /> EN
        </button>
      </header>

      <main className="hero-section text-center px-4">
        <h1 className="hero-title animate-slide-up">
          Emergency Help,<br /> <span className="text-accent">Right When You Need It.</span>
        </h1>
        <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Instantly find nearby trauma centers, ambulances, police, and towing services with one tap.
        </p>

        <div className="cta-wrapper animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            className="cta-button pulse-red" 
            variant="danger" 
            onClick={() => navigate('/dashboard')}
          >
            Get Help Now
          </Button>
        </div>
      </main>

      <section className="features-section bg-white px-4 py-8 radius-t-xl shadow-up animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-center font-semibold mb-6">Why trust RoadSOS?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon bg-blue-100"><Clock color="#2563eb" /></span>
            <h3>Fast Response</h3>
            <p>Connects you directly to the closest available services.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon bg-green-100"><ShieldCheck color="#16a34a" /></span>
            <h3>Verified Contacts</h3>
            <p>100% verified emergency service numbers.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
