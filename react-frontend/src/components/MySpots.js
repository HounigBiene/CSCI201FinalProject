import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dashboard } from './Dashboard';

// Fix for Leaflet default marker icon issue
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

// Editable marker component
const EditableMarker = ({ position, description: initialDescription, markerKey, updateMarkerDescription, deleteMarker }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialDescription || '');

    const handleSave = (e) => {
        e.stopPropagation();
        updateMarkerDescription(markerKey, description);
        setIsEditing(false);
    };

    const handleDelete = (e) => {
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
                                <button onClick={(e) => {e.stopPropagation(); setIsEditing(true);}}>Edit</button>
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

// Current location marker
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
                <div>
                    <strong>Your Current Location</strong>
                    <p>Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
                </div>
            </Popup>
        </Marker>
    );
}

// Listen to map clicks
function MapClickHandler({ setClickPosition, setPanelOpen }) {
    useMapEvents({
        click: (e) => {
            if (!e.originalEvent.target.closest('.leaflet-popup') &&
                !e.originalEvent.target.closest('.leaflet-marker-icon')) {
                setClickPosition([e.latlng.lat, e.latlng.lng]);
                setPanelOpen(true);
            }
        }
    });
    return null;
}

const MainPage = () => {
    const [center, setCenter] = useState([51.505, -0.09]);
    const [markers, setMarkers] = useState([]);
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [clickPosition, setClickPosition] = useState(null);

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

    const handleSave = () => {
        if (clickPosition) {
            addMarker(clickPosition, description);
            setClickPosition(null);
            setDescription('');
            setPanelOpen(false);
        }
    };

    const handleCancel = () => {
        setClickPosition(null);
        setDescription('');
        setPanelOpen(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {/* Dashboard */}
            <Dashboard isOpen={dashboardOpen} toggleDashboard={toggleDashboard} />

            {/* Sidebar Panel */}
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
                        <h3>Add Description</h3>
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

            {/* Map */}
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

                    {/* Map click handler */}
                    <MapClickHandler setClickPosition={setClickPosition} setPanelOpen={setPanelOpen} />

                    {/* Current user location */}
                    <LocationMarker setCenter={setCenter} />
                    {/* Blue PIN!!! */}
                    {clickPosition && (
                        <Marker position={clickPosition} icon={blueIcon}>
                            <Popup>
                                <p>New Spot</p>
                                <p>{clickPosition[0].toFixed(5)}, {clickPosition[1].toFixed(5)}</p>
                            </Popup>
                        </Marker>
                    )}
                    {/* Saved markers */}
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
