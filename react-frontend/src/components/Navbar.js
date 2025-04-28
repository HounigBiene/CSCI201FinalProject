import React from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import "../css/Navbar.css";

export const Navbar = ({ friendOpen, toggleFriend }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Simplified handling - assumes My Spots/Account might be routes or sections later
  const handlePlaceholderClick = (sectionId) => {
    console.log(`Maps or scroll to: ${sectionId}`);
    // Future logic: navigate to a route or scroll if on main page
  };

  console.log("Logged in user:", isLoggedIn);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          USCStudySpot
        </Link>
        <div className="navbar-content">
          {isLoggedIn ? (
            <>
              <a
                className="navbar-link"
                onClick={toggleFriend}
              >
                Friends
              </a>
              <a
                className="navbar-link"
                onClick={() => handlePlaceholderClick("myspots")}
              >
                My Spots
              </a>
              <a
                className="navbar-link"
                onClick={() => handlePlaceholderClick("myaccount")}
              >
                {currentUser?.username || 'My Account'}
              </a>
              <a
                className="navbar-link"
                onClick={handleLogout}
              >
                Log Out
              </a>
            </>
          ) : (
            <>
              <Link to="/signup" className="navbar-link">
                Sign Up
              </Link>
              <Link to="/login" className="navbar-link">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
