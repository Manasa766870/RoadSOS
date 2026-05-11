import React, { useContext, useEffect, useState } from 'react';
import { EmergencyContext } from '../context/EmergencyContext';
import ServiceCard from '../components/common/ServiceCard';
import { Filter, MapPin } from 'lucide-react';
import './pages.css';

const Dashboard = () => {
  const { services, loading, error, requestLocation, fetchNearbyServices, location } = useContext(EmergencyContext);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!location) {
      requestLocation().then((loc) => {
        fetchNearbyServices(loc.lat, loc.lng);
      }).catch(console.error);
    } else if (services.length === 0) {
      fetchNearbyServices(location.lat, location.lng);
    }
  }, [location]);

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleNavigate = (loc) => {
    if (loc && loc.coordinates) {
      const [lng, lat] = loc.coordinates;
      let url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${lat}%2C${lng}`;
      if (location) {
        url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${location.lat}%2C${location.lng}%3B${lat}%2C${lng}`;
      }
      window.open(url);
    }
  };

  const filteredServices = filter ? services.filter(s => s.type === filter) : services;

  return (
    <div className="page-container px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nearby Services</h1>
          <p className="text-sm text-muted flex items-center">
            <MapPin size={14} className="mr-1" />
            {location ? 'Within 50km radius' : 'Locating you...'}
          </p>
        </div>
        <button className="icon-btn bg-white shadow-sm border"><Filter size={20} /></button>
      </div>

      <div className="filter-chips mb-6">
        {['All', 'Hospital', 'Trauma Center', 'Ambulance', 'Police Station', 'Towing'].map(f => (
          <button 
            key={f} 
            className={`chip ${filter === f || (f === 'All' && !filter) ? 'active' : ''}`}
            onClick={() => setFilter(f === 'All' ? '' : f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-10">Fetching nearby help...</div>}
      {error && <div className="text-danger text-center py-4 bg-danger-light rounded-md">{error}</div>}

      <div className="services-list">
        {!loading && filteredServices.map((service, i) => (
          <ServiceCard 
            key={service._id} 
            service={service} 
            onCall={handleCall} 
            onNavigate={handleNavigate} 
          />
        ))}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-10 text-muted">No services found in this area.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
