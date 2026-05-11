import React from 'react';
import { Phone, Navigation, Clock, CheckCircle } from 'lucide-react';
import Button from './Button';

const ServiceCard = ({ service, onCall, onNavigate }) => {
  const distanceStr = service.distance ? `${(service.distance / 1000).toFixed(1)} km` : (service.distance === 0 ? '0 km' : 'Near');
  const durationStr = service.duration ? `${Math.ceil(service.duration / 60)} min` : (service.duration === 0 ? '0 min' : '');
  
  return (
    <div className="card service-card slide-up">
      <div className="service-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{service.name}</h3>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500', display: 'block' }}>{distanceStr}</span>
          {durationStr && <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem', marginTop: '0.2rem' }}><Clock size={14} /> {durationStr}</span>}
        </div>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ 
          display: 'inline-block', 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: service.isOpen ? '#22c55e' : '#ef4444' 
        }}></span>
        {service.isOpen ? 'Open Now' : 'Closed'} • {service.type}
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="primary" style={{ flex: 1 }} onClick={() => onCall(service.contactNumber)}>
          <Phone size={18} /> Call
        </Button>
        <Button variant="outline" style={{ flex: 1 }} onClick={() => onNavigate(service.location)}>
          <Navigation size={18} /> Nav
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
