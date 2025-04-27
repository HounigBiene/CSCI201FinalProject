import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Hardcoded favorite spots for now
const favoriteSpots = [
    {
        id: 1,
        name: "Leavey Library",
        description: "Great study spot open 24/7 with tons of seating.",
        position: [34.0212, -118.2837]
    },
    {
        id: 2,
        name: "Fertitta",
        description: "Nice place to grab coffee and study indoors or outdoors.",
        position: [34.0189, -118.2823]
    },
    {
        id: 3,
        name: "Bench on Sidewalk",
        description: "Great place to study with lots of noise.",
        position: [34.0205, -118.2901]
    }
];

// Custom icon
const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Fly the map when a spot is clicked
function FlyToLocation({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 17); // zoom level 17
        }
    }, [position, map]);
    return null;
}

const MySpots = () => {
    const [selectedSpotId, setSelectedSpotId] = useState(null);
    const [flyToPosition, setFlyToPosition] = useState(null);

    const handleSpotClick = (spot) => {
        setSelectedSpotId(spot.id);
        setFlyToPosition(spot.position);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {/* Sidebar */}
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
                overflowY: 'auto',
                pointerEvents: 'none'
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <h3>My Favorite Spots</h3>
                    {favoriteSpots.map(spot => (
                        <div key={spot.id} style={{ marginBottom: '10px' }}>
                            <div
                                onClick={() => handleSpotClick(spot)}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: selectedSpotId === spot.id ? 'bold' : 'normal',
                                    backgroundColor: selectedSpotId === spot.id ? '#e0e0e0' : 'transparent',
                                    padding: '5px',
                                    borderRadius: '5px'
                                }}
                            >
                                {spot.name}
                            </div>
                            {selectedSpotId === spot.id && (
                                <div style={{ fontSize: '0.9em', marginTop: '5px', paddingLeft: '10px' }}>
                                    {spot.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 55px)', marginTop: '55px' }}>
                <MapContainer
                    center={[34.0212, -118.2837]} // default center
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    {/* If flyToPosition is set, fly there */}
                    {flyToPosition && <FlyToLocation position={flyToPosition} />}

                    {/* Markers */}
                    {favoriteSpots.map(spot => (
                        <Marker key={spot.id} position={spot.position} icon={blueIcon}>
                            <Popup>{spot.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MySpots;
