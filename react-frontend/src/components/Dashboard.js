import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css"; 

export const Dashboard = ({ isOpen, toggleDashboard }) => {
    const dashboardStyle = {
      position: 'absolute',
      left: isOpen ? '0' : '-250px',
      top: '60px', // Adjusted to account for navbar height
      height: 'calc(100% - 60px)', // Adjusted to account for navbar height
      width: '250px',
      backgroundColor: 'white',
      boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
      transition: 'left 0.3s ease',
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box'
    };
  
    return (
      <div style={dashboardStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Home</a>
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Profile</a>
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Maps</a>
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Settings</a>
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Help</a>
          </li>
        </ul>
      </div>
    );
};