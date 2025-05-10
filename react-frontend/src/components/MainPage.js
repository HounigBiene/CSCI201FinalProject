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

const MainPage = ({ friendOpen, toggleFriend, userId }) => {
  const location = useLocation();
  const isSpotsPage = location.pathname === '/spots';
  const [center, setCenter] = useState([34.02051, -118.28563]); // Centered on USC
  const [markers, setMarkers] = useState([]); // User-added markers
  const [dbSpots, setDbSpots] = useState([]); // All spots from database
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [spotName, setSpotName] = useState("");
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const { isLoggedIn, currentUser } = useAuth();
  const [prevFavorites, setFavoriteSpots] = useState([]);
  const [popupData, setPopupData] = useState({});
  const [dbSpotsData, setDbSpotsData] = useState({});
  const [friendVotes, setFriendVotes] = useState({});

  console.log(currentUser);
  console.log("dbSpots:", dbSpots);
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchUserFavorites();
    }
  }, [isLoggedIn, currentUser]);

  const fetchAllData = async () => {
    try {
      // Fetch all study spots
      const spotsResponse = await fetch("http://localhost:8080/api/studyspots");
      if (!spotsResponse.ok) {
        throw new Error(`HTTP error! status: ${spotsResponse.status}`);
      }
      const spotsData = await spotsResponse.json();

      // Fetch friend votes if user is logged in
      if (isLoggedIn && currentUser) {
        try {
          const response = await fetch(`http://localhost:8080/api/friends/list?username=${currentUser.username}`);
          if (response.ok) {
            const friends = await response.json();
            const friendVotesPromises = friends.map(async (friend) => {
              const voteResponse = await fetch(`http://localhost:8080/api/vote/user/${friend.userId}`);
              if (!voteResponse.ok) return [];
              const votes = await voteResponse.json();
              return votes.filter(vote => vote.voteType === 'upvote').map(vote => vote.spotId);
            });

            const allFriendVotes = await Promise.all(friendVotesPromises);
            const friendVotesMap = allFriendVotes.flat().reduce((acc, spotId) => {
              acc[spotId] = true;
              return acc;
            }, {});

            setFriendVotes(friendVotesMap);
          }
        } catch (error) {
          console.error('Error fetching friend votes:', error);
        }
      }

      // Fetch detailed data for each spot
      const spotsWithVotes = await Promise.all(spotsData.map(async (spot) => {
        const [upvotesResponse, downvotesResponse, userVoteResponse, checkInResponse, userCheckInResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/vote/upvotes/${spot.locationId}`),
          fetch(`http://localhost:8080/api/vote/downvotes/${spot.locationId}`),
          fetch(`http://localhost:8080/api/vote/user/${currentUser?.userId}/spot/${spot.locationId}`),
          fetch(`http://localhost:8080/api/checkin/${spot.locationId}/total`),
          isLoggedIn && currentUser ? fetch(`http://localhost:8080/api/checkin/${spot.locationId}/user/${currentUser.userId}`) : Promise.resolve({ ok: false })
        ]);

        const upvotesData = await upvotesResponse.json();
        const downvotesData = await downvotesResponse.json();
        const voteData = await userVoteResponse.json();
        const checkInData = await checkInResponse.json();
        const userCheckInData = userCheckInResponse.ok ? await userCheckInResponse.json() : false;

        console.log(`Spot ${spot.locationId} check-in data:`, {
          userCheckInResponse: userCheckInResponse.ok,
          userCheckInData,
          spotName: spot.name
        });

        return {
          ...spot,
          upvotes: typeof upvotesData === 'number' ? upvotesData : 0,
          downvotes: typeof downvotesData === 'number' ? downvotesData : 0,
          userVoteType: voteData.voteType || null,
          currentCheckInCount: checkInData || 0,
          checkedIn: userCheckInData
        };
      }));

      setDbSpots(spotsWithVotes);

      // Update dbSpotsData with the latest information
      const newDbSpotsData = spotsWithVotes.reduce((acc, spot) => {
        acc[spot.locationId] = {
          upvotes: spot.upvotes,
          downvotes: spot.downvotes,
          userVoteType: spot.userVoteType,
          currentCheckInCount: spot.currentCheckInCount,
          checkedIn: spot.checkedIn
        };
        return acc;
      }, {});

      console.log('Updated dbSpotsData:', newDbSpotsData);
      setDbSpotsData(newDbSpotsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 3000);
    return () => clearInterval(intervalId);
  }, [isLoggedIn, currentUser]);

  const getMarkerIcon = (spot) => {
    if (!isLoggedIn) return blueIcon;

    const isUpvotedByUser = dbSpotsData[spot.locationId]?.userVoteType === 'upvote';
    const isUpvotedByFriend = friendVotes[spot.locationId];

    return (isUpvotedByUser || isUpvotedByFriend) ? redIcon : blueIcon;
  };

  const toggleDashboard = (e) => {
    if (e) e.stopPropagation();
    setDashboardOpen(!dashboardOpen);
  };

  const toggleFavorite = async (markerId, e) => {
    // Prevent event propagation to avoid triggering map events
    if (e) e.stopPropagation();
    if (!isLoggedIn || !currentUser) {
      alert("Please log in to save favorites");
      return;
    }

    const isFavorite = prevFavorites.includes(markerId);
    console.log(isFavorite);

    try {
      const { userId } = currentUser;
      const requestOptions = {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          spotId: markerId
        })
      };

      const response = await fetch('http://localhost:8080/api/favorites', requestOptions);

      if (response.ok) {

      } else {
        console.error("Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }

    setFavoriteSpots(prevFavorites =>
      prevFavorites.includes(markerId)
        ? prevFavorites.filter(id => id !== markerId)
        : [...prevFavorites, markerId]
    );
  };

  const fetchUserFavorites = async () => {
    const { userId } = currentUser;
    try {
      const response = await fetch(`http://localhost:8080/api/favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        setFavoriteSpots(favorites.map(fav => fav.spotId));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const EditableMarker = ({
    marker,
    onEditClick,
    onDeleteClick,
    upvoteMarker,
    downvoteMarker,
    toggleCheckIn,
  }) => (
    <Marker position={marker.position} icon={redIcon}>
      <Popup closeButton={true} closeOnClick={false}>
        <div>
          <h4 style={{ margin: '0 0 5px' }}>
            {marker.name || 'New Spot'}
            <FavoriteStar markerId={marker.id || `marker-${marker.position.join('-')}`} />
          </h4>
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
                backgroundColor: userVotes[marker.key] === "upvote" ? "#1e7e34" : "#28a745",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "10px",
                verticalAlign: "center",
                transform: userVotes[marker.key] === "upvote" ? "scale(0.95)" : "scale(1)",
                transition: "all 0.2s ease"
              }}
            >
              ↑
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                downvoteMarker(marker.key);
              }}
              style={{
                backgroundColor: userVotes[marker.key] === "downvote" ? "#d39e00" : "#ffc107",
                color: "black",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "10px",
                verticalAlign: "center",
                transform: userVotes[marker.key] === "downvote" ? "scale(0.95)" : "scale(1)",
                transition: "all 0.2s ease"
              }}
            >
              ↓
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

  const addMarker = async (position, name, description) => {
    try {
      const data = {
        name: name,
        description: description,
        latitude: position[0],
        longitude: position[1],
        userId: currentUser?.userId || null // Make userId optional
      };

      const response = await fetch("http://localhost:8080/api/addspot", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newSpot = await response.json();

      // Add the new spot to the state with initial values
      setDbSpots(prev => [...prev, {
        ...newSpot,
        upvotes: 0,
        downvotes: 0,
        userVoteType: null,
        currentCheckInCount: 0
      }]);

      // Show a message encouraging login if user is not logged in
      if (!isLoggedIn) {
        alert("Spot added! Log in to enable voting, check-ins, and other features.");
      }
    } catch (error) {
      console.error("Error adding spot:", error);
      alert("Failed to add spot. Please try again.");
    }
  };

  const FavoriteStar = ({ markerId }) => {
    const isFavorite = prevFavorites.includes(markerId);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <span
        className="favorite-star"
        onClick={(e) => toggleFavorite(markerId, e)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: 'pointer',
          color: isFavorite ? 'gold' : 'gray',
          fontSize: '1.25rem',
          marginLeft: '15px', // Add spacing between star and text
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
          transition: 'all 0.2s linear',
          display: 'inline-block'
        }}
      >
        ★
      </span>
    );
  };

  const updateMarker = async (key, newName, newDescription) => {
    try {
      const spot = dbSpots.find(s => s.locationId === key);
      if (!spot) return;

      const response = await fetch(`http://localhost:8080/api/studyspots/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setDbSpots(prev =>
        prev.map(spot =>
          spot.locationId === key
            ? { ...spot, name: newName, description: newDescription }
            : spot
        )
      );
    } catch (error) {
      console.error("Error updating spot:", error);
      alert("Failed to update spot. Please try again.");
    }
  };

  const deleteMarker = async (spotId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/addspot/${spotId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete spot');
      }

      setDbSpots(prevSpots => prevSpots.filter(spot => spot.locationId !== spotId));
    } catch (error) {
      console.error('Error deleting spot:', error);
      alert('Failed to delete spot. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!spotName.trim()) {
      return alert("Please enter a name for the spot.");
    }
    if (clickPosition) {
      await addMarker(clickPosition, spotName, description);
    }
    setClickPosition(null);
    setDescription("");
    setSpotName("");
    setPanelOpen(false);
  };

  const handleCancel = () => {
    setClickPosition(null);
    setDescription("");
    setSpotName("");
    setPanelOpen(false);
  };

  const upvoteMarker = (key) => {
    if (userVotes[key] === "upvote") {
      setMarkers((current) =>
        current.map((marker) =>
          marker.key === key
            ? { ...marker, upvotes: marker.upvotes - 1 }
            : marker
        )
      );
      setUserVotes((prev) => ({ ...prev, [key]: null }));
    } else {
      if (userVotes[key] === "downvote") {
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
      if (userVotes[key] === "upvote") {
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

  const upvoteDbSpot = async (key) => {
    if (!isLoggedIn || !currentUser) {
      alert("Please log in to vote");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/vote/upvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          spotId: key
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      const [upvotesResponse, downvotesResponse, userVoteResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/vote/upvotes/${key}`),
        fetch(`http://localhost:8080/api/vote/downvotes/${key}`),
        fetch(`http://localhost:8080/api/vote/user/${currentUser.userId}/spot/${key}`)
      ]);

      const upvotesData = await upvotesResponse.json();
      const downvotesData = await downvotesResponse.json();
      const voteData = await userVoteResponse.json();

      // Immediately update the spot data
      setDbSpotsData(prevData => ({
        ...prevData,
        [key]: {
          ...prevData[key],
          upvotes: typeof upvotesData === 'number' ? upvotesData : 0,
          downvotes: typeof downvotesData === 'number' ? downvotesData : 0,
          userVoteType: voteData.voteType || null
        }
      }));

      // Also update the spots array to maintain consistency
      setDbSpots(prevSpots =>
        prevSpots.map(spot =>
          spot.locationId === key
            ? {
              ...spot,
              upvotes: typeof upvotesData === 'number' ? upvotesData : 0,
              downvotes: typeof downvotesData === 'number' ? downvotesData : 0,
              userVoteType: voteData.voteType || null
            }
            : spot
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
      alert("Failed to update vote. Please try again.");
    }
  };

  const downvoteDbSpot = async (key) => {
    if (!isLoggedIn || !currentUser) {
      alert("Please log in to vote");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/vote/downvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          spotId: key
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      const [upvotesResponse, downvotesResponse, userVoteResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/vote/upvotes/${key}`),
        fetch(`http://localhost:8080/api/vote/downvotes/${key}`),
        fetch(`http://localhost:8080/api/vote/user/${currentUser.userId}/spot/${key}`)
      ]);

      const upvotesData = await upvotesResponse.json();
      const downvotesData = await downvotesResponse.json();
      const voteData = await userVoteResponse.json();

      // Immediately update the spot data
      setDbSpotsData(prevData => ({
        ...prevData,
        [key]: {
          ...prevData[key],
          upvotes: typeof upvotesData === 'number' ? upvotesData : 0,
          downvotes: typeof downvotesData === 'number' ? downvotesData : 0,
          userVoteType: voteData.voteType || null
        }
      }));

      // Also update the spots array to maintain consistency
      setDbSpots(prevSpots =>
        prevSpots.map(spot =>
          spot.locationId === key
            ? {
              ...spot,
              upvotes: typeof upvotesData === 'number' ? upvotesData : 0,
              downvotes: typeof downvotesData === 'number' ? downvotesData : 0,
              userVoteType: voteData.voteType || null
            }
            : spot
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
      alert("Failed to update vote. Please try again.");
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
      const response = await fetch(`http://localhost:8080/api/checkin/${locationId}/user/${userId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Check-in failed');
      }

      console.log('Check-in successful for spot:', locationId);

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

      // Also update dbSpotsData
      setDbSpotsData(prevData => ({
        ...prevData,
        [locationId]: {
          ...prevData[locationId],
          checkedIn: true,
          currentCheckInCount: (prevData[locationId]?.currentCheckInCount || 0) + 1
        }
      }));
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
      const response = await fetch(`http://localhost:8080/api/checkin/${locationId}/user/${userId}/checkout`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      console.log('Check-out successful for spot:', locationId);

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

      // Also update dbSpotsData
      setDbSpotsData(prevData => ({
        ...prevData,
        [locationId]: {
          ...prevData[locationId],
          checkedIn: false,
          currentCheckInCount: Math.max(0, (prevData[locationId]?.currentCheckInCount || 0) - 1)
        }
      }));
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
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
            <h3>Add New Marker</h3>
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
          zoomControl={false}
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
            <Marker position={clickPosition} icon={redIcon}>
              <Popup>New Spot Location</Popup>
            </Marker>
          )}

          {dbSpots.map((spot) => (
            <Marker
              key={`db-${spot.locationId}`}
              position={[spot.latitude, spot.longitude]}
              icon={getMarkerIcon(spot)}
            >
              <Popup>
                <strong style={{ margin: '0 0 5px' }}>{spot.name || "Study Spot"} (
                  <span style={{ color: (dbSpotsData[spot.locationId]?.currentCheckInCount || spot.currentCheckInCount) >= 5 ? 'red' : (dbSpotsData[spot.locationId]?.currentCheckInCount || spot.currentCheckInCount) >= 2 ? 'orange' : 'green' }}>
                    {(dbSpotsData[spot.locationId]?.currentCheckInCount || spot.currentCheckInCount) >= 5 ? 'Busy' : (dbSpotsData[spot.locationId]?.currentCheckInCount || spot.currentCheckInCount) >= 2 ? 'Moderate' : 'Empty'}
                  </span>
                  )
                  {isLoggedIn && <FavoriteStar markerId={spot.locationId} />}
                </strong>
                <br />
                {spot.description || "No description."}
                <br />
                Coordinates: {spot.latitude.toFixed(5)},{" "}
                {spot.longitude.toFixed(5)}
                <p>
                  Number of Current People: {dbSpotsData[spot.locationId]?.currentCheckInCount || spot.currentCheckInCount || 0}
                </p>
                <p>
                  Number of Likes: {dbSpotsData[spot.locationId]?.upvotes || spot.upvotes || 0}
                </p>
                <div>
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          upvoteDbSpot(spot.locationId);
                        }}
                        style={{
                          backgroundColor: (dbSpotsData[spot.locationId]?.userVoteType || spot.userVoteType) === "upvote" ? "#1e7e34" : "#28a745",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "10px",
                          verticalAlign: "center",
                          margin: "5px",
                          transform: (dbSpotsData[spot.locationId]?.userVoteType || spot.userVoteType) === "upvote" ? "scale(0.95)" : "scale(1)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        ↑
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downvoteDbSpot(spot.locationId);
                        }}
                        style={{
                          backgroundColor: (dbSpotsData[spot.locationId]?.userVoteType || spot.userVoteType) === "downvote" ? "#d39e00" : "#ffc107",
                          color: "black",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "10px",
                          verticalAlign: "center",
                          margin: "5px",
                          transform: (dbSpotsData[spot.locationId]?.userVoteType || spot.userVoteType) === "downvote" ? "scale(0.95)" : "scale(1)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        ↓
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
                        onClick={() => (dbSpotsData[spot.locationId]?.checkedIn || spot.checkedIn) ? toggleDbSpotCheckOut(spot.locationId) : toggleDbSpotCheckIn(spot.locationId)}
                      >
                        {(dbSpotsData[spot.locationId]?.checkedIn || spot.checkedIn) ? "Check Out" : "Check In"}
                      </button>
                    </>
                  ) : (
                    <div style={{ color: '#666', fontSize: '0.9em', marginBottom: '10px' }}>
                      Log in to vote and check in!
                    </div>
                  )}
                  {isLoggedIn && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMarker(spot.locationId);
                        }}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          margin: "5px"
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MainPage;
