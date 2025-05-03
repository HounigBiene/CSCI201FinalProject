import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import "../css/Navbar.css";

export const MySpots = ({ isOpen, toggleDashboard }) => {
    const { currentUser } = useAuth();
    const dashboardStyle = {
        position: 'absolute',
        right: isOpen ? '0' : '-400px',
        top: '60px',
        height: 'calc(100% - 60px)',
        width: '400px',
        backgroundColor: 'white',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
        transition: 'right 0.3s ease',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box'
    };

    return (
        <div style={dashboardStyle} onClick={(e) => e.stopPropagation()}>
            <h2>My Spots</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Saved Spots</a>
                </li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Recent Visits</a>
                </li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Favorites</a>
                </li>
            </ul>
        </div>
    );
};