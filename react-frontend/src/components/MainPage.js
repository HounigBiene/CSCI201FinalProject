import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Friend } from './Friend';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({ setClickPosition, setSelectedMarkerKey, setDescription, setSpotName, setPanelOpen }) {
  useMapEvents({
    click: (e) => {
      if (!e.originalEvent.target.closest('.leaflet-popup') &&
          !e.originalEvent.target.closest('.leaflet-marker-icon')) {
        setClickPosition([e.latlng.lat, e.latlng.lng]);
        setSelectedMarkerKey(null);
        setDescription('');
        setSpotName('');
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

const EditableMarker = ({ marker, onEditClick, onDeleteClick, upvoteMarker, downvoteMarker }) => (
  <Marker position={marker.position} icon={blueIcon}>
    <Popup closeButton={true} closeOnClick={false}>
      <div>
        <h4 style={{ margin: '0 0 5px' }}>{marker.name || 'New Spot'}</h4> 
        <p style={{ minWidth: '200px' }}>{marker.description || 'No description provided'}</p>
        <p>Location: {marker.position[0].toFixed(5)}, {marker.position[1].toFixed(5)}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <button onClick={onEditClick}>Edit</button>
          <button onClick={(e) => { e.stopPropagation(); upvoteMarker(marker.key); }} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>
            ↑ <span>{marker.upvotes}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); downvoteMarker(marker.key); }} style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>
            ↓ <span>{marker.downvotes}</span>
          </button>
          <button onClick={onDeleteClick} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
            Delete
          </button>
        </div>
      </div>
    </Popup>
  </Marker>
);

const MainPage = ({ friendOpen, toggleFriend }) => {
  const [center, setCenter] = useState([34.02051, -118.28563]);
  const [markers, setMarkers] = useState([]);
  const [dbSpots, setDbSpots] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [spotName, setSpotName] = useState('');
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const fetchStudySpots = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studyspots');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDbSpots(data);
      } catch (error) {
        console.error("Failed to fetch study spots:", error);
      }
    };
    fetchStudySpots();
  }, []);

  const addMarker = (position, name, description) => {
    setMarkers(current => [...current, {
      position: position,
      name: name,
      description: description,
      upvotes: 0,
      downvotes: 0,
      key: Date.now()
    }]);
  };

  const handleSave = () => {
    if (!spotName.trim()) {
      return alert('Please enter a name for the spot.');
    }
    if (selectedMarkerKey) {
      setMarkers(current =>
        current.map(marker => marker.key === selectedMarkerKey ? { ...marker, description } : marker)
      );
    } else if (clickPosition) {
      addMarker(clickPosition, spotName, description);
    }
    setSelectedMarkerKey(null);
    setClickPosition(null);
    setDescription('');
    setSpotName('');
    setPanelOpen(false);
  };

  const handleCancel = () => {
    setSelectedMarkerKey(null);
    setClickPosition(null);
    setDescription('');
    setPanelOpen(false);
  };

  const upvoteMarker = (key) => {
    if (userVotes[key] === 'upvote') {
      setMarkers(current =>
        current.map(marker => marker.key === key ? { ...marker, upvotes: marker.upvotes - 1 } : marker)
      );
      setUserVotes(prev => ({ ...prev, [key]: null }));
    } else {
      if (userVotes[key] === 'downvote') {
        setMarkers(current =>
          current.map(marker => marker.key === key ? { ...marker, downvotes: marker.downvotes - 1 } : marker)
        );
      }
      setMarkers(current =>
        current.map(marker => marker.key === key ? { ...marker, upvotes: marker.upvotes + 1 } : marker)
      );
      setUserVotes(prev => ({ ...prev, [key]: 'upvote' }));
    }
  };

  const downvoteMarker = (key) => {
    if (userVotes[key] === 'downvote') {
      setMarkers(current =>
        current.map(marker => marker.key === key ? { ...marker, downvotes: marker.downvotes - 1 } : marker)
      );
      setUserVotes(prev => ({ ...prev, [key]: null }));
    } else {
      if (userVotes[key] === 'upvote') {
        setMarkers(current =>
          current.map(marker => marker.key === key ? { ...marker, upvotes: marker.upvotes - 1 } : marker)
        );
      }
      setMarkers(current =>
        current.map(marker => marker.key === key ? { ...marker, downvotes: marker.downvotes + 1 } : marker)
      );
      setUserVotes(prev => ({ ...prev, [key]: 'downvote' }));
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Friend isOpen={friendOpen} toggleDashboard={toggleFriend} />
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 55px)', marginTop: '55px' }}>
        <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <MapClickHandler setClickPosition={setClickPosition} setSelectedMarkerKey={setSelectedMarkerKey} setDescription={setDescription} setSpotName={setSpotName} setPanelOpen={setPanelOpen} />
          <LocationMarker setCenter={setCenter} />

          {clickPosition && !selectedMarkerKey && (
            <Marker position={clickPosition} icon={blueIcon}>
              <Popup>New Spot Location</Popup>
            </Marker>
          )}

          {dbSpots.map(spot => (
            <Marker
              key={`db-${spot.locationId}`}
              position={[spot.latitude, spot.longitude]}
              icon={blueIcon}
            >
              <Popup>
                <strong>
                  {spot.name} (
                  <span style={{ color: spot.currentCheckInCount >= 5 ? 'red' : spot.currentCheckInCount >= 2 ? 'orange' : 'green' }}>
                    {spot.currentCheckInCount >= 5 ? 'Busy' : spot.currentCheckInCount >= 2 ? 'Moderate' : 'Empty'}
                  </span>
                  )
                </strong><br />
                {spot.description || 'No description.'}<br />
                Coordinates: {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}<br />
                Number of Current People: {spot.currentCheckInCount || 0}
              </Popup>
            </Marker>
          ))}

          {markers.map(marker => (
            <EditableMarker
              key={marker.key}
              marker={marker}
              onEditClick={(e) => {
                e.stopPropagation();
                setSelectedMarkerKey(marker.key);
                setDescription(marker.description || '');
                setPanelOpen(true);
                setClickPosition(null);
              }}
              onDeleteClick={(e) => {
                e.stopPropagation();
                setMarkers(current => current.filter(m => m.key !== marker.key));
              }}
              upvoteMarker={upvoteMarker}
              downvoteMarker={downvoteMarker}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MainPage;