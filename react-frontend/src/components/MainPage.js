import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Friend } from './Friend';

// Fix for Leaflet default marker icon issue
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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

function MapClickHandler({ setClickPosition, setSelectedMarkerKey, setDescription, setPanelOpen }) {
  useMapEvents({
    click: (e) => {
      if (!e.originalEvent.target.closest('.leaflet-popup') &&
          !e.originalEvent.target.closest('.leaflet-marker-icon')) {
        setClickPosition([e.latlng.lat, e.latlng.lng]);
        setSelectedMarkerKey(null);
        setDescription('');
        setPanelOpen(true);
      }
    }
  });
  return null;
}

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
          <strong>Your Current Location</strong>
        </Popup>
      </Marker>
  );
}

const EditableMarker = ({ marker, onEditClick, onDeleteClick }) => (
    <Marker position={marker.position} icon={blueIcon}>
      <Popup closeButton={true} closeOnClick={false}>
        <div>
          <p style={{ minWidth: '200px' }}>{marker.description || 'No description provided'}</p>
          <p>Location: {marker.position[0].toFixed(5)}, {marker.position[1].toFixed(5)}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <button onClick={onEditClick}>Edit</button>
            <button
                onClick={onDeleteClick}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
);

const MainPage = ({ friendOpen, toggleFriend }) => {
  const [center, setCenter] = useState([51.505, -0.09]);
  const [markers, setMarkers] = useState([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState(null);

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
            marker.key === key ? { ...marker, description: newDescription } : marker
        )
    );
  };

  const deleteMarker = (key) => {
    setMarkers(current => current.filter(marker => marker.key !== key));
  };

  const handleSave = () => {
    if (selectedMarkerKey) {
      updateMarkerDescription(selectedMarkerKey, description);
    } else if (clickPosition) {
      addMarker(clickPosition, description);
    }
    setSelectedMarkerKey(null);
    setClickPosition(null);
    setDescription('');
    setPanelOpen(false);
  };

  const handleCancel = () => {
    setSelectedMarkerKey(null);
    setClickPosition(null);
    setDescription('');
    setPanelOpen(false);
  };

  return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <Friend isOpen={friendOpen} toggleDashboard={toggleFriend} />

        {panelOpen && (
            <div style={{
              position: 'absolute',
              top: '55px',
              right: 0,
              width: '300px',
              height: 'calc(100vh - 55px)',
              backgroundColor: '#f8f9fa',
              borderLeft: '1px solid #ddd',
              padding: '20px',
              boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
              zIndex: 1000,
              pointerEvents: 'none'
            }}>
              <div style={{ pointerEvents: 'auto' }}>
                <h3>{selectedMarkerKey ? 'Edit Marker' : 'Add New Marker'}</h3>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={10}
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </div>
        )}

        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 55px)', marginTop: '55px' }}>
          <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            <MapClickHandler setClickPosition={setClickPosition} setSelectedMarkerKey={setSelectedMarkerKey} setDescription={setDescription} setPanelOpen={setPanelOpen} />
            <LocationMarker setCenter={setCenter} />

            {clickPosition && (
                <Marker position={clickPosition} icon={blueIcon}>
                  <Popup>New Spot</Popup>
                </Marker>
            )}

            {markers.map(marker => (
                <EditableMarker
                    key={marker.key}
                    marker={marker}
                    onEditClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarkerKey(marker.key);
                      setDescription(marker.description || '');
                      setPanelOpen(true);
                    }}
                    onDeleteClick={(e) => {
                      e.stopPropagation();
                      deleteMarker(marker.key);
                    }}
                />
            ))}
          </MapContainer>
        </div>
      </div>
  );
};

export default MainPage;
