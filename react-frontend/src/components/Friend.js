import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import "../css/Navbar.css"; // Assuming this holds relevant styles

export const Friend = ({ isOpen, toggleDashboard }) => {
  const { isLoggedIn, currentUser } = useAuth(); // Get auth state
  console.log("isLoggedIn:", isLoggedIn);
  console.log("currentUser:", currentUser);
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

  const { userId, username } = currentUser;

  // Fetch friends and pending requests when the panel is opened and user is logged in
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      setError(''); // Clear previous errors
/*
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
      */
      // --- End Dummy Data Section ---

      // --- Commented out Fetch Logic ---
      console.log("Current user:", currentUser);
      fetchFriends();
      fetchPendingRequests();
      // --- End Commented out Fetch Logic ---

    } else {
      // Clear lists when panel is closed or user logs out
      setFriends([]);
      setPendingRequests([]);
    }
  }, [isOpen, isLoggedIn]); // Rerun effect if panel opens/closes or login status changes

  // Commented out fetch functions

  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const response = await fetch(`http://localhost:8080/api/friends/list?username=${currentUser.username}`, {
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
      const response = await fetch(`http://localhost:8080/api/friends/requests/pending?username=${currentUser.username}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Transform the backend response to include userId (needed for accept/decline)
      const formattedData = data.map(req => ({
        userId: req.senderUserId,         // <-- from backend: sender user ID
        username: req.senderUsername,    // <-- from backend: sender username
        status: req.status               // <-- from backend: request status (optional, but you’re already including it)
      }));

      setPendingRequests(formattedData);
    } catch (fetchError) {
      console.error("Failed to fetch pending requests:", fetchError);
      setError('Could not load pending requests.');
    } finally {
      setIsLoadingRequests(false);
    }
  };


  const handleAccept = async (senderId) => {
    setError('');
    try {
      const sender = pendingRequests.find(req => req.userId === senderId);
      if (!sender) {
        setError('Sender not found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUsername: sender.username,
          receiverUsername: currentUser.username
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      // Refresh both lists from backend
      await fetchFriends();
      await fetchPendingRequests();
    } catch (actionError) {
      console.error("Failed to accept request:", actionError);
      setError(`Failed to accept request: ${actionError.message}`);
    }
  };

  const handleDecline = async (senderId) => {
    setError('');
    try {
      const sender = pendingRequests.find(req => req.userId === senderId);
      if (!sender) {
        setError('Sender not found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/friends/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUsername: sender.senderUsername,  // fixed here
          receiverUsername: currentUser.username
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      setPendingRequests(currentRequests => currentRequests.filter(req => req.userId !== senderId));
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    console.log("searching for " , trimmedSearch);
    try{
      const response = await fetch('/api/users/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedSearch })
      });
      const data = await response.json();
      console.log("Results:", data);
      if (data.length === 1) {
        setSearchResults(data);
        const receiverUsername = data[0].username;
        console.log("Sending friend request to:", receiverUsername);
        sendFriendRequest(receiverUsername);
      }
    }
    catch (error){
      console.error("could not search for ", error);
    }
  };
  const sendFriendRequest = async (receiverUsername) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUsername: username,
          receiverUsername: receiverUsername
        })
      });
      const data = await response.json();
      console.log("Friend request response:", data);
    } catch (error) {
      console.error("Error sending friend request", error);
    }
  };
  return (
    <div style={dashboardStyle} onClick={(e) => e.stopPropagation()}>
      {isLoggedIn ? (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div
            style={{
              display: 'flex',
              margin: '5px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <form onSubmit={handleSubmit}>
              <><input
                  type="text"
                  id="friend-search"
                  value={(searchTerm)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for friends"
              />
                <span
                    style={{marginLeft: '8px'}}
                >
                  <button
                      type="submit"
                      className="submit-friend-search"
                  >
                    search
                  </button>
              </span></>
            </form>
          </div>

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