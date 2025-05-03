import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Friend } from "./Friend";
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from "react-router-dom";

import iconShadow from "leaflet/dist/images/marker-shadow.png";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({
  setClickPosition,
  setSelectedMarkerKey,
  setDescription,
  setSpotName,
  setPanelOpen,
}) {
  useMapEvents({
    click: (e) => {
      if (
        !e.originalEvent.target.closest(".leaflet-popup") &&
        !e.originalEvent.target.closest(".leaflet-marker-icon")
      ) {
        setClickPosition([e.latlng.lat, e.latlng.lng]);
        setSelectedMarkerKey(null);
        setDescription("");
        setSpotName("");
        setPanelOpen(true);
      }
    },
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
    },
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

const EditableMarker = ({
  marker,
  onEditClick,
  onDeleteClick,
  upvoteMarker,
  downvoteMarker,
  toggleCheckIn,
}) => (
  <Marker position={marker.position} icon={blueIcon}>
    <Popup closeButton={true} closeOnClick={false}>
      <div>
        <h4 style={{ margin: "0 0 5px" }}>{marker.name || "New Spot"}</h4>
        <p style={{ minWidth: "200px" }}>
          {marker.description || "No description provided"}
        </p>
        <p>
          Location: {marker.position[0].toFixed(5)},{" "}
          {marker.position[1].toFixed(5)}
        </p>
        <p>
          Number of Current People: {marker.checkInCount || 0}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
          }}
        >
          <button onClick={onEditClick}>Edit</button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              upvoteMarker(marker.key);
            }}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
              verticalAlign: "center",
            }}
          >
            ↑ <span>{marker.upvotes}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              downvoteMarker(marker.key);
            }}
            style={{
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
              verticalAlign: "center",
            }}
          >
            ↓ <span>{marker.downvotes}</span>
          </button>
          <button
            onClick={onDeleteClick}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              backgroundColor: "#7481a8",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => toggleCheckIn(marker.key)}            
          >
            {marker.checkedIn ? "Check Out" : "Check In"}
          </button>
        </div>
      </div>
    </Popup>
  </Marker>
);

const MainPage = ({ friendOpen, toggleFriend, userId }) => {
  const location = useLocation();
  const isSpotsPage = location.pathname === '/spots';
  const [center, setCenter] = useState([34.02051, -118.28563]); // Centered on USC
  const [markers, setMarkers] = useState([]); // User-added markers
  const [dbSpots, setDbSpots] = useState([]); // Spots from database
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [spotName, setSpotName] = useState("");
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const { currentUser } = useAuth();

  console.log(currentUser);
  console.log("dbSpots:", dbSpots);

  useEffect(() => {
    const fetchStudySpots = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/studyspots");
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
  }, []); // Empty dependency array ensures this runs only once on mount
  useEffect(() => {
    if (selectedMarkerKey) {
      const spotToEdit = dbSpots.find(s => s.key === selectedMarkerKey);
      if (spotToEdit) {
        setSpotName(spotToEdit.name);
        setDescription(spotToEdit.description);
      }
    } else {
      setSpotName("");
      setDescription("");
    }
  }, [selectedMarkerKey, dbSpots]);

  const toggleDashboard = (e) => {
    if (e) e.stopPropagation();
    setDashboardOpen(!dashboardOpen);
  };

  const addMarker = (position, name, description) => {
    setMarkers((current) => [
      ...current,
      {
        position: position,
        name: name,
        description: description,
        upvotes: 0,
        downvotes: 0,
        checkedIn: false,
        key: Date.now(),
      },
    ]);
  };

  const updateMarkerDescription = (key, newDescription) => {
    setMarkers((current) =>
      current.map((marker) =>
        marker.key === key ? { ...marker, description: newDescription } : marker
      )
    );
  };
  const updateMarker = (key, newName, newDescription) => {
    setMarkers(current =>
      current.map(marker =>
        marker.key === key
          ? { 
              ...marker, 
              name: newName, 
              description: newDescription 
            }
          : marker
      )
    );
  };

  const deleteMarker = (key) => {
    setMarkers((current) => current.filter((marker) => marker.key !== key));
  };

  const handleSave = () => {
    if (!spotName.trim()) {
      return alert("Please enter a name for the spot.");
    }
    if (selectedMarkerKey) {
      updateMarker(selectedMarkerKey, spotName, description);
    } else if (clickPosition) {
      addMarker(clickPosition, spotName, description);
      console.log(clickPosition[0]);
      console.log(clickPosition[1]);
      const data = {
        name: spotName,
        description,
        latitude: clickPosition[0],
        longitude: clickPosition[1]
      };
      const response = await fetch("http://localhost:8080/api/addspot",
        {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })      
      .catch(error => {
        console.log("Error: ", error);
      });
    }
    setSelectedMarkerKey(null);
    setClickPosition(null);
    setDescription("");
    setSpotName("");
    setPanelOpen(false);
  };

  const handleCancel = () => {
    setSelectedMarkerKey(null);
    setClickPosition(null);
    setDescription("");
    setPanelOpen(false);
  };

  const upvoteMarker = (key) => {
    if (userVotes[key] === "upvote") {
      //unvote
      setMarkers((current) =>
        current.map((marker) =>
          marker.key === key
            ? { ...marker, upvotes: marker.upvotes - 1 }
            : marker
        )
      );
      setUserVotes((prev) => ({ ...prev, [key]: null }));
    } else {
      //if downvoted
      if (userVotes[key] === "downvote") {
        // If so, remove the downvote and update the state
        setMarkers((current) =>
          current.map((marker) =>
            marker.key === key
              ? { ...marker, downvotes: marker.downvotes - 1 }
              : marker
          )
        );
      }

      setMarkers((current) =>
        current.map((marker) =>
          marker.key === key
            ? { ...marker, upvotes: marker.upvotes + 1 }
            : marker
        )
      );
      setUserVotes((prev) => ({ ...prev, [key]: "upvote" }));
    }
  };

  const downvoteMarker = (key) => {
    if (userVotes[key] === "downvote") {
      setMarkers((current) =>
        current.map((marker) =>
          marker.key === key
            ? { ...marker, downvotes: marker.downvotes - 1 }
            : marker
        )
      );
      setUserVotes((prev) => ({ ...prev, [key]: null }));
    } else {
      //if upvoted
      if (userVotes[key] === "upvote") {
        // If so, remove the downvote and update the state
        setMarkers((current) =>
          current.map((marker) =>
            marker.key === key
              ? { ...marker, upvotes: marker.upvotes - 1 }
              : marker
          )
        );
      }

      setMarkers((current) =>
        current.map((marker) =>
          marker.key === key
            ? { ...marker, downvotes: marker.downvotes + 1 }
            : marker
        )
      );
      setUserVotes((prev) => ({ ...prev, [key]: "downvote" }));
    }
  };

  const toggleCheckIn = (key) => {
    // Toggle check-in status for the marker
    setMarkers((current) =>
      current.map((marker) =>
        marker.key === key
          ? {
              ...marker,
              checkedIn: !marker.checkedIn,
              checkInCount: marker.checkedIn
                  ? Math.max(0, marker.checkInCount - 1)
                  : (marker.checkInCount || 0) + 1,
            }
          : marker
      )
    );
  };


  const upvoteDbSpot = (key) => {
    if (userVotes[key] === "upvote") {
      //unvote
      setDbSpots((prevSpots) =>
          prevSpots.map((spot) =>
              spot.locationId === key
                  ? {
                    ...spot,
                    upvotes: Math.max(0, (spot.upvotes || 0) - 1),
                    }
                  : spot
          )
      );
      setUserVotes((prev) => ({ ...prev, [key]: null }));
    } else {
      //if downvoted
      if (userVotes[key] === "downvote") {
        // If so, remove the downvote and update the state
        setDbSpots((prevSpots) =>
            prevSpots.map((spot) =>
                spot.locationId === key
                    ? { ...spot,
                      downvotes: Math.max(0, (spot.downvotes || 0) - 1),}
                    : spot
            )
        );
      }

      setDbSpots((prevSpots) =>
          prevSpots.map((spot) =>
              spot.locationId === key
                  ? { ...spot,
                    upvotes: (spot.upvotes || 0) + 1 }
                  : spot
          )
      );
      setUserVotes((prev) => ({ ...prev, [key]: "upvote" }));
      // TODO: Connect to database to update upvotes in the backend
    }
  };

  const downvoteDbSpot = (key) => {
    if (userVotes[key] === "downvote") {
      setDbSpots((prevSpots) =>
          prevSpots.map((spot) =>
              spot.locationId === key
                  ? { ...spot,
                    downvotes: Math.max(0, (spot.downvotes || 0) - 1),}
                  : spot
          )
      );
      setUserVotes((prev) => ({ ...prev, [key]: null }));
    } else {
      //if upvoted
      if (userVotes[key] === "upvote") {
        // If so, remove the downvote and update the state
        setDbSpots((prevSpots) =>
            prevSpots.map((spot) =>
                spot.locationId === key
                    ? { ...spot,
                      upvotes: Math.max(0, (spot.upvotes || 0) - 1),}
                    : spot
            )
        );
      }

      setDbSpots((prevSpots) =>
          prevSpots.map((spot) =>
              spot.locationId === key
                  ? { ...spot, downvotes: (spot.downvotes || 0) + 1 }
                  : spot
          )
      );
      setUserVotes((prev) => ({ ...prev, [key]: "downvote" }));
      // TODO: Connect to database to update downvotes in the backend
    }
  };

  const toggleDbSpotCheckIn = async (locationId) => {
    const { userId } = currentUser;
    console.log("Checking in with locationId:", locationId, "and userId:", userId); // Debug log
    if (!userId || !locationId) {
      console.error('Missing userId or locationId:', userId, locationId);
      return;
    }
    try {
      const response = await fetch(`/api/checkin/${locationId}/user/${userId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Check-in failed');
      }

      // Toggle check-in status for the marker
      setDbSpots((prevSpots) =>
          prevSpots.map((spot) =>
            spot.locationId === locationId
                ? {
                  ...spot,
                  checkedIn: true,  // Check-in status
                  currentCheckInCount: spot.currentCheckInCount + 1,  // Increment on check-in
                }
                : spot
          )
      );
    } catch (error) {
      console.error('Error during check-in:', error);
    }
  };

  const toggleDbSpotCheckOut = async (locationId) => {
    const { userId } = currentUser;
    console.log("Checking out with locationId:", locationId, "and userId:", userId); // Debug log
    if (!userId || !locationId) {
      console.error('Missing userId or locationId:', userId, locationId);
      return;
    }

    try {
      const response = await fetch(`/api/checkin/${locationId}/user/${userId}/checkout`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      // Toggle check-out status for the marker
      setDbSpots((prevSpots) =>
          prevSpots.map((spot) =>
              spot.locationId === locationId
                  ? {
                    ...spot,
                    checkedIn: false,  // Set as not checked in
                    currentCheckInCount: spot.currentCheckInCount - 1,  // Decrement on checkout
                  }
                  : spot
          )
      );
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Friend isOpen={friendOpen} toggleDashboard={toggleFriend} />

      {panelOpen && (
        <div
          style={{
            position: "absolute",
            top: "55px",
            right: 0,
            width: "300px",
            height: "calc(100vh - 55px)",
            backgroundColor: "#f8f9fa",
            borderLeft: "1px solid #ddd",
            padding: "20px",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <h3>{selectedMarkerKey ? "Edit Marker" : "Add New Marker"}</h3>
            <input
              type="text"
              placeholder="Spot Name"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 10,
                padding: "8px",
                boxSizing: "border-box",
              }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              style={{
                width: "100%",
                marginBottom: 10,
                padding: "8px",
                boxSizing: "border-box",
                fontFamily: "inherit",
                fontSize: "0.8rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 50px)",
          marginTop: "50px"
        }}
      >
        <MapContainer
          center={center}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapClickHandler
            setClickPosition={setClickPosition}
            setSelectedMarkerKey={setSelectedMarkerKey}
            setDescription={setDescription}
            setSpotName={setSpotName}
            setPanelOpen={setPanelOpen}
          />
          <LocationMarker setCenter={setCenter} />

          {clickPosition && !selectedMarkerKey && (
            <Marker position={clickPosition} icon={blueIcon}>
              <Popup>New Spot Location</Popup>
            </Marker>
          )}

          {!isSpotsPage && dbSpots.map((spot) => (
            <Marker
              key={`db-${spot.locationId}`}
              position={[spot.latitude, spot.longitude]}
              icon={blueIcon}
            >
              <Popup>
                <strong>{spot.name || "Study Spot"} (
                    <span style={{ color: spot.currentCheckInCount >= 5 ? 'red' : spot.currentCheckInCount >= 2 ? 'orange' : 'green' }}>
                      {spot.currentCheckInCount >= 5 ? 'Busy' : spot.currentCheckInCount >= 2 ? 'Moderate' : 'Empty'}
                    </span>
                    )                        
                    </strong>
                <br />
                {spot.description || "No description."}
                <br />
                Coordinates: {spot.latitude.toFixed(5)},{" "}
                {spot.longitude.toFixed(5)}
                <p>
                  Number of Current People: {spot.currentCheckInCount || 0}
                </p>
                <div>
                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        upvoteDbSpot(spot.locationId);
                      }}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "10px",
                        verticalAlign: "center",
                        margin: "5px"
                      }}
                  >
                    ↑ <span>{spot.upvotes}</span>
                  </button>

                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downvoteDbSpot(spot.locationId);
                      }}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "10px",
                        verticalAlign: "center",
                        margin: "5px"
                      }}
                  >
                    ↓ <span>{spot.downvotes}</span>
                  </button>
                  <button
                      style={{
                        backgroundColor: "#7481a8",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        margin: "5px"
                      }}
                      onClick={() => spot.checkedIn ? toggleDbSpotCheckOut(spot.locationId) : toggleDbSpotCheckIn(spot.locationId)}
                  >
                    {spot.checkedIn ? "Check Out" : "Check In"}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {markers.map((marker) => (
            <EditableMarker
              key={marker.key}
              marker={marker}
              onEditClick={(e) => {
                e.stopPropagation();
                setSelectedMarkerKey(marker.key);
                setDescription(marker.description || "");
                setSpotName(marker.name || "");
                setPanelOpen(true);
                setClickPosition(null);
              }}
              onDeleteClick={(e) => {
                e.stopPropagation();
                deleteMarker(marker.key);
              }}
              upvoteMarker={upvoteMarker}
              downvoteMarker={downvoteMarker}
              toggleCheckIn={toggleCheckIn}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MainPage;
