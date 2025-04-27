import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../css/Navbar.css";

export const Navbar = ({ friendOpen, toggleFriend }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/${sectionId}`);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          USCStudySpot
        </Link>
        <div className="navbar-content">
          <a
            className="navbar-link"
            onClick={() => {
              handleNavigation("");
              toggleFriend();
            }}
          >
            Friends
          </a>
          <Link to="/myspots" className="navbar-link">
            My Spots
          </Link>
          <Link to="/signup" className="navbar-link">
            Sign Up
          </Link>
          <Link to="/login" className="navbar-link">
            Log In
          </Link>
          <a
            className="navbar-link"
            onClick={() => handleNavigation("myaccount")}
          >
            My Account
          </a>
        </div>
      </div>
    </nav>
  );
};
