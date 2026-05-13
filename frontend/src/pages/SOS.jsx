import React, { useState } from 'react';
import { Phone, ShieldAlert, Share2, Users } from 'lucide-react';
import Button from '../components/common/Button';
import { useTranslation } from '../context/LanguageContext';

const SOS = () => {
  const [pulse, setPulse] = useState(false);
  const { t } = useTranslation();

  const handlePanicClick = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
    // Ideally triggering an emergency alert
    alert(t('sosActivatedAlert'));
  };

  return (
    <div className="page-container flex flex-col items-center justify-center p-4 bg-danger-light min-h-[calc(100vh-140px)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-accent mb-2">{t('emergency')}</h1>
        <p className="text-muted">{t('tapButtonForAssistance')}</p>
      </div>

      <button 
        className={`sos-panic-btn ${pulse ? 'panic-active' : ''}`}
        onClick={handlePanicClick}
      >
        <span>{t('navSOS')}</span>
      </button>

      <div className="mt-12 w-full max-w-md flex flex-col gap-4">
        <Button variant="danger" className="w-full justify-start text-lg py-4 shadow-sm" onClick={() => window.location.href="tel:108"}>
          <Phone size={24} className="mr-3" /> {t('callNearestAmbulance')}
        </Button>
        <Button variant="primary" className="w-full justify-start text-lg py-4 shadow-sm" onClick={() => window.location.href="tel:100"}>
          <ShieldAlert size={24} className="mr-3" /> {t('callPolice')}
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 py-3 bg-white" onClick={() => alert(t('shareLocation'))}>
            <Share2 size={20} className="mr-2" /> {t('shareLocation')}
          </Button>
          <Button variant="outline" className="flex-1 py-3 bg-white">
            <Users size={20} className="mr-2" /> {t('contacts')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SOS;
