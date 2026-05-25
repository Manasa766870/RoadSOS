import React, { useContext } from 'react';
import { EmergencyContext } from '../context/EmergencyContext';
import ServiceCard from '../components/common/ServiceCard';
import { WifiOff, RefreshCcw } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const Offline = () => {
  const { services } = useContext(EmergencyContext);
  const { t } = useTranslation();
  
  // Try to load from localStorage if context somehow missed it
  const cached = localStorage.getItem('cachedServices');
  const fallbackServices = services.length > 0 ? services : (cached ? JSON.parse(cached) : []);

  const handleCall = (number) => window.location.href = `tel:${number}`;
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      alert('Still offline. Please reconnect and try again.');
    }
  };

  return (
    <div className="page-container flex flex-col items-center p-4 min-h-[calc(100vh-140px)]">
      <div className="text-center my-8 w-full max-w-md">
        <WifiOff size={48} className="text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-danger">{t('noInternetTitle')}</h1>
        <p className="text-muted mb-3">
          You are currently offline. The app is showing saved data from your last successful connection.
        </p>
        <button
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          onClick={handleRetry}
        >
          <RefreshCcw size={18} /> Retry Connection
        </button>
      </div>

      <div className="services-list w-full max-w-md">
        {fallbackServices.length > 0 ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
              <p className="text-sm text-muted">
                Showing {fallbackServices.length} cached emergency contacts. Tap a card to call directly.
              </p>
            </div>
            {fallbackServices.map((service, i) => (
              <ServiceCard 
                key={service._id || i}
                service={service}
                onCall={handleCall}
                onNavigate={() => { alert('Navigation requires an internet connection.'); }}
              />
            ))}
          </>
        ) : (
          <div className="card p-6 text-center">
            <h3 className="text-lg font-semibold mb-3">{t('nationalEmergencyNumbers')}</h3>
            <p className="text-sm text-muted mb-4">
              No cached nearby services are available yet. Use one of the emergency numbers below.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <button className="btn btn-danger w-full justify-between" onClick={() => handleCall('112')}>
                <span>{t('allEmergencies')}</span> <span>112</span>
              </button>
              <button className="btn btn-outline w-full justify-between" onClick={() => handleCall('100')}>
                <span>{t('police')}</span> <span>100</span>
              </button>
              <button className="btn btn-outline w-full justify-between" onClick={() => handleCall('108')}>
                <span>{t('ambulanceLabel')}</span> <span>108</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offline;
