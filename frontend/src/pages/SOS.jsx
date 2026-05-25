import React, { useState } from 'react';
import { Phone, ShieldAlert, Share2, MapPin, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const SOS = () => {
  const [pulse, setPulse] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locationSuccess, setLocationSuccess] = useState('');
  const [sendingLocation, setSendingLocation] = useState(false);
  const { t } = useTranslation();

  const emergencyNumbers = [
    { name: 'National Emergency', number: '112', color: '#dc2626' },
    { name: 'Police', number: '100', color: '#000000' },
    { name: 'Fire Service', number: '101', color: '#0000ff' },
    { name: 'Women Helpline', number: '1091', color: '#dc2626' },
    { name: 'Disaster Management', number: '1078', color: '#dc2626' },
    { name: 'Child Helpline', number: '1098', color: '#000000' },
    { name: 'Road Accident', number: '1073', color: '#0000ff' },
    { name: 'Highway Helpline', number: '1033', color: '#dc2626' },
    { name: 'Railway Emergency', number: '139', color: '#dc2626' },
    { name: 'Traffic Police', number: '103', color: '#000000' },
    { name: 'Senior Citizen', number: '14567', color: '#0000ff' },
    { name: 'Mental Health', number: '1800-599-0019', color: '#dc2626' },
  ];

  const handlePanicClick = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
    getLocation(true);
  };

  const getLocation = (showAlert = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLocationError('');
          setLocationSuccess('✅ Location captured successfully!');
          setTimeout(() => setLocationSuccess(''), 3000);
          
          if (showAlert) {
            alert(`${t('sosActivatedAlert')}\n\n📍 Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          let errorMessage = 'Unable to get location. Please enable location services.';
          setLocationError(errorMessage);
          setTimeout(() => setLocationError(''), 4000);
          if (showAlert) {
            alert(t('sosActivatedAlert'));
          }
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setTimeout(() => setLocationError(''), 4000);
      if (showAlert) {
        alert(t('sosActivatedAlert'));
      }
    }
  };

  const handleShareLocation = async () => {
    if (!userLocation) {
      await getLocation();
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!userLocation) {
        alert('Please enable location services and try again.');
        return;
      }
    }

    setSendingLocation(true);
    const { latitude, longitude } = userLocation;
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    const locationText = `🚨 EMERGENCY ASSISTANCE NEEDED! 🚨\n\nMy current location:\n📍 ${mapsLink}\n📌 Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nPlease send help immediately!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emergency Location',
          text: locationText,
          url: mapsLink,
        });
        setLocationSuccess('✅ Location shared successfully!');
        setTimeout(() => setLocationSuccess(''), 3000);
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        fallbackShare(locationText);
      }
    } else {
      fallbackShare(locationText);
    }
    setSendingLocation(false);
  };

  const fallbackShare = (locationText) => {
    navigator.clipboard.writeText(locationText);
    const userChoice = window.confirm(
      '📍 Location copied to clipboard!\n\nWould you like to:\n• OK - Open Messages to share\n• Cancel - Copy only'
    );
    
    if (userChoice) {
      window.location.href = `sms:?body=${encodeURIComponent(locationText)}`;
    } else {
      setLocationSuccess('✅ Location copied to clipboard!');
      setTimeout(() => setLocationSuccess(''), 3000);
    }
  };

  const handleCallEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <>
      <style>
        {`
          /* SOS Page Styles */
          .sos-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
            padding: 20px;
          }

          .sos-content {
            max-width: 1280px;
            margin: 0 auto;
          }

          /* Header Styles */
          .sos-header {
            text-align: center;
            margin-bottom: 40px;
            animation: slideUp 0.4s ease-out;
          }

          .sos-title {
            font-size: 48px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 8px;
          }

          .sos-subtitle {
            color: #6b7280;
            font-size: 16px;
          }

          /* SOS Panic Button */
          .sos-panic-btn {
            position: relative;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 4px;
            cursor: pointer;
            box-shadow: 0 15px 35px -10px rgba(220, 38, 38, 0.5);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            border: none;
            margin: 0 auto;
          }

          .sos-panic-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 40px -10px rgba(220, 38, 38, 0.6);
          }

          .sos-panic-btn:active {
            transform: scale(0.95);
          }

          .panic-active {
            animation: panicPulse 0.5s ease-in-out 3;
          }

          @keyframes panicPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 0 0 30px rgba(220, 38, 38, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
            }
          }

          /* Toast Notifications */
          .toast-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            padding: 12px 24px;
            border-radius: 9999px;
            font-weight: 600;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .toast-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }

          .toast-error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-100%);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          /* Location Card */
          .location-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin-bottom: 32px;
            animation: slideUp 0.4s ease-out;
          }

          .location-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #1f2937;
          }

          .location-success-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
            animation: slideUp 0.3s ease-out;
          }

          .location-success-text {
            color: white;
            font-size: 14px;
            margin: 0;
          }

          .location-link {
            color: white;
            font-size: 12px;
            text-decoration: underline;
            margin-top: 8px;
            display: inline-block;
          }

          .location-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          /* Button Styles */
          .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 24px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
          }

          .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
          }

          .btn-danger {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
          }

          .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
          }

          .btn:active {
            transform: translateY(0);
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* Quick Actions */
          .quick-actions {
            margin-bottom: 32px;
          }

          .section-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #1f2937;
          }

          .quick-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .quick-btn {
            padding: 20px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
          }

          .quick-btn-ambulance {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
          }

          .quick-btn-police {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }

          .quick-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }

          .quick-btn:active {
            transform: translateY(0);
          }

          /* Emergency Numbers Grid */
          .emergency-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 12px;
          }

          .emergency-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
            color: white;
          }

          .emergency-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }

          .emergency-card:active {
            transform: translateY(0);
          }

          .emergency-name {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .emergency-number {
            font-size: 12px;
            opacity: 0.9;
            font-family: monospace;
          }

          /* Animations */
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .sos-title {
              font-size: 36px;
            }
            
            .sos-panic-btn {
              width: 160px;
              height: 160px;
              font-size: 28px;
            }
            
            .quick-buttons {
              grid-template-columns: 1fr;
            }
            
            .location-buttons {
              grid-template-columns: 1fr;
            }
            
            .emergency-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="sos-container">
        <div className="sos-content">
          {/* Toast Notifications */}
          {locationSuccess && (
            <div className="toast-notification toast-success">
              <CheckCircle size={20} />
              <span>{locationSuccess}</span>
            </div>
          )}

          {locationError && (
            <div className="toast-notification toast-error">
              <X size={20} />
              <span>{locationError}</span>
            </div>
          )}

          {/* Header */}
          <div className="sos-header">
            <h1 className="sos-title">{t('emergency')}</h1>
            <p className="sos-subtitle">{t('tapButtonForAssistance')}</p>
          </div>

          {/* Centered SOS Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
            <button 
              className={`sos-panic-btn ${pulse ? 'panic-active' : ''}`}
              onClick={handlePanicClick}
            >
              <div style={{ textAlign: 'center' }}>
                <AlertTriangle size={48} style={{ margin: '0 auto 8px auto' }} />
                <span>SOS</span>
                <div style={{ fontSize: '12px', marginTop: '4px', letterSpacing: '1px' }}>EMERGENCY</div>
              </div>
            </button>
          </div>

          {/* Location Services Card */}
          <div className="location-card">
            <h2 className="location-title">
              <MapPin color="#dc2626" size={24} />
              Location Services
            </h2>
            
            {userLocation && (
              <div className="location-success-box">
                <p className="location-success-text">
                  📍 Current Location: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                </p>
                <a 
                  href={`https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  Open in Google Maps →
                </a>
              </div>
            )}

            <div className="location-buttons">
              <button
                onClick={() => getLocation(false)}
                className="btn btn-primary"
              >
                <MapPin size={20} />
                Get My Location
              </button>
              <button
                onClick={handleShareLocation}
                disabled={sendingLocation}
                className="btn btn-danger"
              >
                <Share2 size={20} />
                {sendingLocation ? 'Sharing...' : 'Share Location'}
              </button>
            </div>
          </div>

          {/* Quick Emergency Actions */}
          <div className="quick-actions">
            <h2 className="section-title">
              <Phone color="#dc2626" size={24} />
              Quick Emergency Call
            </h2>
            <div className="quick-buttons">
              <button
                onClick={() => handleCallEmergency('108')}
                className="quick-btn quick-btn-ambulance"
              >
                <Phone size={28} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'normal' }}>Ambulance</div>
                  <div>108</div>
                </div>
              </button>
              <button
                onClick={() => handleCallEmergency('100')}
                className="quick-btn quick-btn-police"
              >
                <ShieldAlert size={28} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'normal' }}>Police</div>
                  <div>100</div>
                </div>
              </button>
            </div>
          </div>

          {/* All Emergency Numbers */}
          <div>
            <h2 className="section-title">All Emergency Services</h2>
            <div className="emergency-grid">
              {emergencyNumbers.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCallEmergency(item.number)}
                  className="emergency-card"
                  style={{ background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)` }}
                >
                  <Phone size={22} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div className="emergency-name">{item.name}</div>
                    <div className="emergency-number">{item.number}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SOS;