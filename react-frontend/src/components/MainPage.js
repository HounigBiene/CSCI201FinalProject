import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom icons for markers
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component for editable markers with descriptions
const EditableMarker = ({ position, description: initialDescription, markerKey, updateMarkerDescription, deleteMarker }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || '');

  const handleSave = (e) => {
    // Prevent event propagation to the map
    e.stopPropagation();
    updateMarkerDescription(markerKey, description);
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    // Prevent event propagation to the map
    e.stopPropagation();
    deleteMarker(markerKey);
  };

  return (
    <Marker position={position} icon={blueIcon}>
      <Popup closeButton={true} closeOnClick={false}>
        <div onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', marginBottom: '8px', minWidth: '200px' }}
                rows={3}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <button onClick={handleSave}>Save</button>
                <button onClick={(e) => {e.stopPropagation(); setIsEditing(false);}}>Cancel</button>
                <button
                  onClick={handleDelete}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ minWidth: '200px' }}>{description || 'No description provided'}</p>
              <p>Location: {position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <button onClick={(e) => {e.stopPropagation(); setIsEditing(true);}}>Edit Description</button>
                <button
                  onClick={handleDelete}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

// Component to handle map clicks
function MapClickHandler({ addMarker }) {
  const [clickPosition, setClickPosition] = useState(null);
  const [description, setDescription] = useState('');

  const map = useMapEvents({
    click: (e) => {
      // Only set clickPosition if we're not clicking on a marker/popup
      if (!e.originalEvent.target.closest('.leaflet-popup') &&
          !e.originalEvent.target.closest('.leaflet-marker-icon')) {
        setClickPosition([e.latlng.lat, e.latlng.lng]);
      }
    }
  });

  const handleSaveMarker = (e) => {
    e.stopPropagation();
    if (clickPosition) {
      addMarker(clickPosition, description);
      setClickPosition(null);
      setDescription('');
    }
  };

  const handleCancelMarker = (e) => {
    e.stopPropagation();
    setClickPosition(null);
    setDescription('');
  };

  return clickPosition ? (
    <Marker position={clickPosition} icon={blueIcon}>
      <Popup closeButton={true} closeOnClick={false} onClose={() => setClickPosition(null)}>
        <div onClick={(e) => e.stopPropagation()}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for this location..."
            style={{ width: '100%', marginBottom: '8px', minWidth: '200px' }}
            rows={3}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleSaveMarker}>Save</button>
            <button onClick={handleCancelMarker}>Cancel</button>
          </div>
        </div>
      </Popup>
    </Marker>
  ) : null;
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
    <Marker position={position} icon={redIcon}>
      <Popup>
        <div onClick={(e) => e.stopPropagation()}>
          <strong>Your Current Location</strong>
          <p>Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

// Dashboard component
const Dashboard = ({ isOpen, toggleDashboard }) => {
  const dashboardStyle = {
    position: 'absolute',
    left: isOpen ? '0' : '-250px',
    top: '60px', // Adjusted to account for navbar height
    height: 'calc(100% - 60px)', // Adjusted to account for navbar height
    width: '250px',
    backgroundColor: 'white',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    padding: '20px',
    boxSizing: 'border-box'
  };

  return (
    <div style={dashboardStyle} onClick={(e) => e.stopPropagation()}>
      <h2>Dashboard</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Home</a>
        </li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Profile</a>
        </li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Maps</a>
        </li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Settings</a>
        </li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Help</a>
        </li>
      </ul>
    </div>
  );
};

// Top Navigation Bar component with USC colors
const TopNavigationBar = ({ toggleDashboard, isOpen }) => {
  const navbarStyle = {
    backgroundColor: '#990000', // USC Cardinal color
    height: '50px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 15px',
    boxSizing: 'border-box',
    position: 'relative',
    borderBottom: '5px solid #FFCC00', // USC Gold/Yellow strip
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1001
  };

  const dashboardButtonStyle = {
    backgroundColor: '#770000', // Slightly darker than the navbar
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    transition: 'background-color 0.2s',
    fontSize: '16px'
  };

  const navLinksContainerStyle = {
    display: 'flex',
    gap: '15px'
  };

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  };

  return (
    <div style={navbarStyle}>
      <button
        style={dashboardButtonStyle}
        onClick={toggleDashboard}
      >
        {isOpen ? '← Close Menu' : '☰ Menu'}
      </button>

      <div style={navLinksContainerStyle}>
        <Link to="/login" style={navLinkStyle}>Login</Link>
        <Link to="/signup" style={navLinkStyle}>Sign Up</Link>
      </div>
    </div>
  );
};

const MainPage = () => {
  const [center, setCenter] = useState([51.505, -0.09]); // Default to London
  const [markers, setMarkers] = useState([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const toggleDashboard = (e) => {
    if (e) e.stopPropagation();
    setDashboardOpen(!dashboardOpen);
  };

  const addMarker = (position, description) => {
    setMarkers(current => [...current, {
      position: position,
      description: description,
      key: Date.now()
    }]);
  };

  const updateMarkerDescription = (key, newDescription) => {
    setMarkers(current =>
      current.map(marker =>
        marker.key === key
          ? { ...marker, description: newDescription }
          : marker
      )
    );
  };

  const deleteMarker = (key) => {
    setMarkers(current => current.filter(marker => marker.key !== key));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Top Navigation Bar */}
      <TopNavigationBar toggleDashboard={toggleDashboard} isOpen={dashboardOpen} />

      {/* Dashboard */}
      <Dashboard isOpen={dashboardOpen} toggleDashboard={toggleDashboard} />

      {/* Adjusted container for the map */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 55px)', marginTop: '55px' }}>
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
          <MapClickHandler addMarker={addMarker} />

          {/* Get user location */}
          <LocationMarker setCenter={setCenter} />

          {/* Display all saved markers with delete functionality */}
          {markers.map(marker => (
            <EditableMarker
              key={marker.key}
              markerKey={marker.key}
              position={marker.position}
              description={marker.description}
              updateMarkerDescription={updateMarkerDescription}
              deleteMarker={deleteMarker}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MainPage;
