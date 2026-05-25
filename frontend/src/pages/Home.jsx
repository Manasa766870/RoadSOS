import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import LanguageSelector from '../components/common/LanguageSelector';
import { useTranslation } from '../context/LanguageContext';
import { ShieldAlert, Clock, ShieldCheck } from 'lucide-react';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <header className="home-header px-4">
  <div className="brand">
    <ShieldAlert color="#ef4444" size={28} />
    <span className="brand-text text-xl ml-2">RoadSOS</span>
  </div>

  {/* Right Side Controls */}
  <div className="flex items-center gap-3">
    <LanguageSelector />

    <Button
      className="px-4 py-2 !opacity-100 !visible"
      variant="danger"
      onClick={() => {
        localStorage.removeItem('roadSOSLoggedIn');
        localStorage.removeItem('roadSOSUser');
        navigate('/');
      }}
    >
      Logout
    </Button>
  </div>
</header>
      <main className="hero-section text-center px-4">
        <h1 className="hero-title animate-slide-up">
          {t('emergencyHelpTitle').split('\n')[0]}<br /> <span className="text-accent">{t('emergencyHelpTitle').split('\n')[1]}</span>
        </h1>
        <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {t('heroSubtitle')}
        </p>

        <div className="cta-wrapper animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            className="cta-button pulse-red" 
            variant="danger" 
            onClick={() => navigate('/dashboard')}
          >
            {t('getHelpNow')}
          </Button>
          
        </div>
      </main>

      <section className="features-section bg-white px-4 py-8 radius-t-xl shadow-up animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-center font-semibold mb-6">{t('whyTrustTitle')}</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon bg-blue-100"><Clock color="#2563eb" /></span>
            <h3>{t('fastResponse')}</h3>
            <p>{t('fastResponseDescription')}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon bg-green-100"><ShieldCheck color="#16a34a" /></span>
            <h3>{t('verifiedContacts')}</h3>
            <p>{t('verifiedContactsDescription')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
