import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import "../css/Navbar.css"; 

export const Friend = ({ isOpen, toggleDashboard }) => {
  // Style for the friend panel, sliding in/out like Dashboard
  const dashboardStyle = {
    position: 'absolute',
    left: isOpen ? '0' : '-250px',
    top: '60px',
    height: 'calc(100% - 60px)',
    width: '250px',
    backgroundColor: 'white',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    padding: '20px',
    boxSizing: 'border-box'
  };

  const { currentUser } = useAuth();
  const { userId, username } = currentUser;

  // Toggle showing the friends list
  const [showFriends, setShowFriends] = useState(false);
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
      <h2>Friends List</h2>

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

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setShowFriends(true)}>+</button>
        <button onClick={() => setShowFriends(false)} style={{ marginLeft: '5px' }}>-</button>
      </div>
      {showFriends && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {/* TODO: map over your friends data here */}
          <li>No friends yet</li>
        </ul>
      )}
    </div>
  );
};