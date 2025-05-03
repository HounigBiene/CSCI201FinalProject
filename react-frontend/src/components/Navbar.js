import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "../css/Navbar.css";

export const Navbar = ({ friendOpen, toggleFriend, spotsOpen, toggleSpots }) => {
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
                onClick={toggleSpots}
              >
                My Spots
              </a>
              <a
                id="username-display"
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
