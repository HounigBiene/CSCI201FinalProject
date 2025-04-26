import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css"; 

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lock/unlock the body scroll based on whether the mobile menu is open
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      // If we're not on the homepage, navigate to homepage with the section hash
      navigate('/' + sectionId);
    } else {
      // If already on homepage, scroll to the section smoothly
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <a 
            onClick={() => handleNavigation('home')} 
            className="navbar-logo"
          >  
            USCStudySpot
          </a> 

          <div 
            className="navbar-menu-icon" 
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            &#9776;
          </div>

          <div className="navbar-links">
            <a 
              onClick={() => handleNavigation('uscmap')} 
              className="navbar-link"
            > 
              USC Map
            </a>
            <a 
              onClick={() => handleNavigation('friends')} 
              className="navbar-link"
            > 
              Friends 
            </a>
            <a 
              onClick={() => handleNavigation('myspots')} 
              className="navbar-link"
            > 
              My Spots 
            </a>
            <a 
              onClick={() => handleNavigation('signup')} 
              className="navbar-link"
            > 
              Sign Up
            </a>
            <a 
              onClick={() => handleNavigation('login')} 
              className="navbar-link"
            > 
              Log In
            </a>
            <a 
              onClick={() => handleNavigation('myaccount')} 
              className="navbar-link"
            > 
              My account
            </a>
          </div>
        </div>
      </div>
      <span id="second-color" />
    </nav>
  );
};