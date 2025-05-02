import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import "../css/Navbar.css"; // Assuming this holds relevant styles

export const Friend = ({ isOpen, toggleDashboard }) => {
  const { isLoggedIn, currentUser } = useAuth(); // Get auth state
  const [friends, setFriends] = useState([]); // State for accepted friends
  const [pendingRequests, setPendingRequests] = useState([]); // State for pending requests
  const [isLoadingFriends, setIsLoadingFriends] = useState(false); // Keep for potential future use
  const [isLoadingRequests, setIsLoadingRequests] = useState(false); // Keep for potential future use
  const [error, setError] = useState('');

  // Style for the friend panel
  const dashboardStyle = {
    position: 'absolute',
    left: isOpen ? '0' : '-300px', // Adjusted width slightly
    top: '55px', // Assuming navbar height is 55px
    height: 'calc(100vh - 55px)',
    width: '300px', // Adjusted width slightly
    backgroundColor: 'white',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto' // Add scroll if content overflows
  };

  // Fetch friends and pending requests when the panel is opened and user is logged in
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      setError(''); // Clear previous errors

      // --- Dummy Data Section ---
      setIsLoadingFriends(false); // Simulate loading finished
      setIsLoadingRequests(false); // Simulate loading finished

      // Set dummy friends list (optional)
      setFriends([
          { userId: 101, username: 'TommyTrojan', email: 'tommy@usc.edu' },
          { userId: 102, username: 'Hecuba', email: 'hecuba@usc.edu' },
      ]);

      // Set dummy pending requests list
      setPendingRequests([
        { userId: 201, username: 'BruinBear', email: 'bruin@ucla.edu' },
        { userId: 202, username: 'TravelerHorse', email: 'traveler@usc.edu' },
        { userId: 203, username: 'GeorgeT', email: 'georget@usc.edu' },
      ]);
      // --- End Dummy Data Section ---

      // --- Commented out Fetch Logic ---
      // fetchFriends();
      // fetchPendingRequests();
      // --- End Commented out Fetch Logic ---

    } else {
      // Clear lists when panel is closed or user logs out
      setFriends([]);
      setPendingRequests([]);
    }
  }, [isOpen, isLoggedIn]); // Rerun effect if panel opens/closes or login status changes

  // Commented out fetch functions
  /*
  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const response = await fetch('http://localhost:8080/api/friends/list', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFriends(data);
    } catch (fetchError) {
      console.error("Failed to fetch friends:", fetchError);
      setError('Could not load friends list.');
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const fetchPendingRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch('http://localhost:8080/api/friends/requests/pending', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPendingRequests(data);
    } catch (fetchError) {
      console.error("Failed to fetch pending requests:", fetchError);
      setError('Could not load pending requests.');
    } finally {
      setIsLoadingRequests(false);
    }
  };
  */

  const handleAccept = async (senderId) => {
    setError('');
    try {
      // --- Commented out Fetch Logic ---
      /*
      const response = await fetch(`http://localhost:8080/api/friends/request/${senderId}/accept`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      */
      console.log(`Simulating accept request from user ${senderId}`);
      // --- End Commented out Fetch Logic ---

      // Refresh lists after accepting (simulate locally)
      const acceptedUser = pendingRequests.find(req => req.userId === senderId);
      if (acceptedUser) {
          setFriends(currentFriends => [...currentFriends, acceptedUser]);
      }
      setPendingRequests(currentRequests => currentRequests.filter(req => req.userId !== senderId));

      // --- Commented out Fetch Logic ---
      // fetchFriends();
      // fetchPendingRequests();
      // --- End Commented out Fetch Logic ---

    } catch (actionError) {
      console.error("Failed to accept request:", actionError);
      setError(`Failed to accept request: ${actionError.message}`);
    }
  };

  const handleDecline = async (senderId) => {
     setError('');
    try {
      // --- Commented out Fetch Logic ---
      /*
      const response = await fetch(`http://localhost:8080/api/friends/request/${senderId}/decline`, {
        method: 'POST', // Or DELETE if backend uses that
        credentials: 'include',
      });
       if (!response.ok) {
         const errorText = await response.text();
         throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      */
      console.log(`Simulating decline request from user ${senderId}`);
      // --- End Commented out Fetch Logic ---

      // Refresh pending requests list after declining/removing (simulate locally)
      setPendingRequests(currentRequests => currentRequests.filter(req => req.userId !== senderId));

      // --- Commented out Fetch Logic ---
      // fetchPendingRequests();
      // --- End Commented out Fetch Logic ---
    } catch (actionError) {
      console.error("Failed to decline request:", actionError);
       setError(`Failed to decline request: ${actionError.message}`);
    }
  };

  // Button styles for accept/decline
  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2em', // Make icons slightly larger
    marginLeft: '10px',
    padding: '0 5px'
  };

  return (
    <div style={dashboardStyle} onClick={(e) => e.stopPropagation()}>
      {isLoggedIn ? (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Friends List Section */}
          <h2>Friends</h2>
          {isLoadingFriends ? <p>Loading friends...</p> : (
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
              {friends.length > 0 ? (
                friends.map(friend => (
                  <li key={friend.userId} style={{ marginBottom: '5px' }}>
                    {friend.username} ({friend.email})
                  </li>
                ))
              ) : (
                <li>No friends yet.</li>
              )}
            </ul>
          )}

          {/* Pending Requests Section */}
          <h2>Pending Requests</h2>
           {isLoadingRequests ? <p>Loading requests...</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pendingRequests.length > 0 ? (
                pendingRequests.map(requestSender => (
                  <li key={requestSender.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span>{requestSender.username}</span>
                    <div>
                      <button
                        onClick={() => handleAccept(requestSender.userId)}
                        style={{ ...actionButtonStyle, color: 'green' }}
                        title="Accept Request"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleDecline(requestSender.userId)}
                        style={{ ...actionButtonStyle, color: 'red' }}
                        title="Decline Request"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                 <li>No pending friend requests.</li>
              )}
            </ul>
           )}
        </>
      ) : (
        <p>Please log in to see friends.</p> // Show message if not logged in
      )}
    </div>
  );
};

export default Friend;