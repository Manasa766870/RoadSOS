import React, { useState } from 'react';
import { Phone, ShieldAlert, Share2, Users } from 'lucide-react';
import Button from '../components/common/Button';

const SOS = () => {
  const [pulse, setPulse] = useState(false);

  const handlePanicClick = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
    // Ideally triggering an emergency alert
    alert('SOS Activated! Sending your coordinates to nearest emergency center.');
  };

  return (
    <div className="page-container flex flex-col items-center justify-center p-4 bg-danger-light min-h-[calc(100vh-140px)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-accent mb-2">EMERGENCY</h1>
        <p className="text-muted">Tap the button for immediate assistance</p>
      </div>

      <button 
        className={`sos-panic-btn ${pulse ? 'panic-active' : ''}`}
        onClick={handlePanicClick}
      >
        <span>SOS</span>
      </button>

      <div className="mt-12 w-full max-w-md flex flex-col gap-4">
        <Button variant="danger" className="w-full justify-start text-lg py-4 shadow-sm" onClick={() => window.location.href="tel:108"}>
          <Phone size={24} className="mr-3" /> Call Nearest Ambulance
        </Button>
        <Button variant="primary" className="w-full justify-start text-lg py-4 shadow-sm" onClick={() => window.location.href="tel:100"}>
          <ShieldAlert size={24} className="mr-3" /> Call Police
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 py-3 bg-white" onClick={() => alert('Location Shared')}>
            <Share2 size={20} className="mr-2" /> Share Location
          </Button>
          <Button variant="outline" className="flex-1 py-3 bg-white">
            <Users size={20} className="mr-2" /> Contacts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SOS;
