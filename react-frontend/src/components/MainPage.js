import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map click events
function MapClickHandler({ setMarkers }) {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      setMarkers(current => [...current, {
        position: [lat, lng],
        key: Date.now()
      }]);
    }
  });
  return null;
}

// Component to get user location
function LocationMarker({ setCenter }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setCenter([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

const MainPage = () => {
  const [center, setCenter] = useState([51.505, -0.09]); // Default to London
  const [markers, setMarkers] = useState([]);

  // Styles for the navigation links
  const navStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '10px 15px',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    display: 'flex',
    gap: '15px'
  };

  const linkStyles = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Navigation links */}
      <div style={navStyles}>
        <Link to="/login" style={linkStyles}>Login</Link>
        <Link to="/signup" style={linkStyles}>Sign Up</Link>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Handle map clicks to add markers */}
        <MapClickHandler setMarkers={setMarkers} />

        {/* Get user location */}
        <LocationMarker setCenter={setCenter} />

        {/* Display all markers */}
        {markers.map(marker => (
          <Marker key={marker.key} position={marker.position}>
            <Popup>
              Marker placed at: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MainPage;
