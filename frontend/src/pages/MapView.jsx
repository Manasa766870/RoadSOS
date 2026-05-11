import React, { useContext, useState, useEffect } from 'react';
import { EmergencyContext } from '../context/EmergencyContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// A small component to auto-center the map when user location is found
const MapPanner = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const MapView = () => {
  const { services, location, requestLocation, fetchNearbyServices } = useContext(EmergencyContext);
  const [route, setRoute] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (!location) {
      requestLocation().then((loc) => {
        fetchNearbyServices(loc.lat, loc.lng);
      }).catch(console.error);
    } else if (services.length === 0) {
      fetchNearbyServices(location.lat, location.lng);
    }
  }, [location, requestLocation, fetchNearbyServices]);

  const handleFetchRoute = async (destLat, destLng) => {
    if (!location) return;
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${destLng},${destLat}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        // GeoJSON uses [lng, lat], Leaflet Polyline expects [lat, lng]
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRoute(coords);
      }
    } catch (e) {
      console.error('Error fetching route:', e);
    }
  };

  const defaultCenter = [12.9716, 77.5946]; // Fallback to Bangalore
  const centerPosition = location ? [location.lat, location.lng] : defaultCenter;

  return (
    <div className="page-container" style={{ padding: 0, height: '100%', position: 'relative' }}>
      <div style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
        <MapContainer 
          center={centerPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapPanner center={location ? [location.lat, location.lng] : null} />

          {/* User Location Marker */}
          {location && (
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* Service Markers */}
          {services.map((service) => {
            const [lng, lat] = service.location.coordinates;
            return (
              <Marker 
                key={service._id} 
                position={[lat, lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedService(service);
                    handleFetchRoute(lat, lng);
                  },
                }}
              >
                <Popup>
                  <strong>{service.name}</strong><br/>
                  {service.type}<br/>
                  <a href={`tel:${service.contactNumber}`}>{service.contactNumber}</a><br/>
                  {selectedService?._id === service._id && route && (
                    <span style={{color: 'green'}}>Route plotted!</span>
                  )}
                </Popup>
              </Marker>
            );
          })}

          {/* Route Polyline */}
          {route && (
            <Polyline positions={route} color="blue" weight={5} opacity={0.6} />
          )}

        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
