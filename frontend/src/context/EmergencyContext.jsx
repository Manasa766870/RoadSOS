import React, { createContext, useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

export const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('roadSOSUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const defaultProfile = {
    name: 'John Doe',
    photo: '',
    address: '123 Main Street, Your City, State',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    medications: 'Inhaler as needed',
    medicalNotes: 'Asthma patient. Carry inhaler. Update additional medical details here.',
    emergencyContacts: [
      { id: 1, name: 'Jane Doe (Wife)', phone: '+919876543210' }
    ]
  };

  const getProfileStorageKey = () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('roadSOSUser'));
      return savedUser && savedUser.email
        ? `roadSOSUserProfile:${savedUser.email.toLowerCase()}`
        : 'roadSOSUserProfile:guest';
    } catch {
      return 'roadSOSUserProfile:guest';
    }
  };

  const [userProfile, setUserProfile] = useState(() => {
    const key = getProfileStorageKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const updateUserProfile = async (newData) => {
    setUserProfile(newData);
    const key = getProfileStorageKey();
    localStorage.setItem(key, JSON.stringify(newData));

    if (currentUser?.id) {
      try {
        const response = await fetch(`${API_BASE}/api/auth/profile/${currentUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });

        if (!response.ok) {
          const data = await response.json();
          console.error('Profile update failed:', data.message || response.statusText);
        }
      } catch (updateError) {
        console.error('Profile update error:', updateError);
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/profile/${currentUser.id}`);
        const data = await response.json();

        if (response.ok && data.success && data.user) {
          const profileData = {
            name: data.user.name || defaultProfile.name,
            photo: data.user.photo || defaultProfile.photo,
            address: data.user.address || defaultProfile.address,
            bloodGroup: data.user.bloodGroup || defaultProfile.bloodGroup,
            allergies: data.user.allergies || defaultProfile.allergies,
            medications: data.user.medications || defaultProfile.medications,
            medicalNotes: data.user.medicalNotes || defaultProfile.medicalNotes,
            emergencyContacts: data.user.emergencyContacts?.length
              ? data.user.emergencyContacts
              : defaultProfile.emergencyContacts,
          };

          setUserProfile(profileData);
          localStorage.setItem(getProfileStorageKey(), JSON.stringify(profileData));
        }
      } catch (fetchError) {
        console.error('Failed to load profile from backend:', fetchError);
      }
    };

    fetchProfile();
  }, [currentUser]);

  useEffect(() => {
    const handleRoadSOSUserChanged = () => {
      try {
        const saved = localStorage.getItem('roadSOSUser');
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener('roadSOSUserChanged', handleRoadSOSUserChanged);

    return () => {
      window.removeEventListener('roadSOSUserChanged', handleRoadSOSUserChanged);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        reject('Not supported');
      } else {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setLocation(loc);
            setLoading(false);
            resolve(loc);
          },
          (err) => {
            setError('Unable to retrieve your location');
            setLoading(false);
            reject(err);
          }
        );
      }
    });
  };

  const fetchNearbyServices = async (lat, lng, type = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const radius = 10000; // 10km radius
      
      // Build Overpass QL query
      let queryNodes = '';
      if (!type || type === 'All' || type === 'Hospital') queryNodes += `node["amenity"~"hospital|clinic"](around:${radius},${lat},${lng});`;
      if (!type || type === 'All' || type === 'Trauma Center') queryNodes += `node["emergency"~"yes|trauma_center"](around:${radius},${lat},${lng});node["healthcare"="trauma_center"](around:${radius},${lat},${lng});`;
      if (!type || type === 'All' || type === 'Ambulance') queryNodes += `node["emergency"="ambulance_station"](around:${radius},${lat},${lng});`;
      if (!type || type === 'All' || type === 'Police Station') queryNodes += `node["amenity"="police"](around:${radius},${lat},${lng});`;
      if (!type || type === 'All' || type === 'Towing') queryNodes += `node["shop"="car_repair"](around:${radius},${lat},${lng});node["craft"="towing"](around:${radius},${lat},${lng});`;

      const query = `[out:json];(${queryNodes});out 20;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.elements) {
        let parsedServices = data.elements.map((el) => {
          let svcType = 'Rescue';
          const tags = el.tags || {};
          if (tags.amenity === 'hospital' || tags.amenity === 'clinic') svcType = 'Hospital';
          else if (tags.amenity === 'police') svcType = 'Police Station';
          else if (tags.emergency === 'ambulance_station') svcType = 'Ambulance';
          else if (tags.shop === 'car_repair' || tags.craft === 'towing') svcType = 'Towing';
          else if (tags.emergency === 'yes' || tags.emergency === 'trauma_center' || tags.healthcare === 'trauma_center') svcType = 'Trauma Center';

          return {
            _id: el.id.toString(),
            name: tags.name || `${svcType} (Unnamed)`,
            type: svcType,
            location: { coordinates: [el.lon, el.lat] },
            contactNumber: tags.phone || tags['contact:phone'] || '112',
            isOpen: true
          };
        });

        if (parsedServices.length > 0) {
          try {
            const dests = parsedServices.slice(0, 90); // limit to 90 locations (OSRM limit is usually 100)
            const coordString = `${lng},${lat};` + dests.map(s => `${s.location.coordinates[0]},${s.location.coordinates[1]}`).join(';');
            const osrmUrl = `https://router.project-osrm.org/table/v1/driving/${coordString}?sources=0&annotations=distance,duration`;
            const osrmRes = await fetch(osrmUrl);
            const osrmData = await osrmRes.json();
            
            if (osrmData.code === 'Ok' && osrmData.distances && osrmData.distances[0]) {
              const distances = osrmData.distances[0];
              const durations = osrmData.durations[0];
              dests.forEach((s, idx) => {
                s.distance = distances[idx + 1];
                s.duration = durations[idx + 1];
              });
              
              parsedServices.sort((a, b) => {
                const distA = a.distance ?? Infinity;
                const distB = b.distance ?? Infinity;
                return distA - distB;
              });
            }
          } catch (routeErr) {
            console.error('OSRM API routing error:', routeErr);
          }
        }
        
        setServices(parsedServices);
        localStorage.setItem('cachedServices', JSON.stringify(parsedServices));
      }
    } catch (err) {
      console.error('Overpass API error:', err);
      setError('Failed to fetch real-time services. Showing cached data.');
      const cached = localStorage.getItem('cachedServices');
      if (cached) setServices(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmergencyContext.Provider
      value={{
        location,
        services,
        loading,
        error,
        isOffline,
        requestLocation,
        fetchNearbyServices,
        userProfile,
        updateUserProfile
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};
