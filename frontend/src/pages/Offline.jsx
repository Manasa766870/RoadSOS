import React, { useContext } from 'react';
import { EmergencyContext } from '../context/EmergencyContext';
import ServiceCard from '../components/common/ServiceCard';
import { WifiOff } from 'lucide-react';

const Offline = () => {
  const { services } = useContext(EmergencyContext);
  
  // Try to load from localStorage if context somehow missed it
  const cached = localStorage.getItem('cachedServices');
  const fallbackServices = services.length > 0 ? services : (cached ? JSON.parse(cached) : []);

  const handleCall = (number) => window.location.href = `tel:${number}`;

  return (
    <div className="page-container flex flex-col items-center p-4 min-h-[calc(100vh-140px)]">
      <div className="text-center my-8">
        <WifiOff size={48} className="text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-danger">No Internet Connection</h1>
        <p className="text-muted mb-6">
          Don't panic. You can still reach these nearby emergency contacts from your last known location.
        </p>
      </div>

      <div className="services-list w-full max-w-md">
        {fallbackServices.length > 0 ? (
          fallbackServices.map((service, i) => (
            <ServiceCard 
              key={service._id || i}
              service={service}
              onCall={handleCall}
              onNavigate={() => { alert('Navigation requires internet connection.'); }}
            />
          ))
        ) : (
          <div className="card p-6 text-center">
            <h3>National Emergency Numbers</h3>
            <div className="flex flex-col gap-3 mt-4">
              <button className="btn btn-danger w-full justify-between" onClick={() => handleCall('112')}>
                <span>All Emergencies</span> <span>112</span>
              </button>
              <button className="btn btn-outline w-full justify-between" onClick={() => handleCall('100')}>
                <span>Police</span> <span>100</span>
              </button>
              <button className="btn btn-outline w-full justify-between" onClick={() => handleCall('108')}>
                <span>Ambulance</span> <span>108</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offline;
