import React, {useState, useEffect} from 'react';
import { useAuth } from '../contexts/AuthContext';
import "../css/Navbar.css";

export const MySpots = ({ isOpen, toggleDashboard }) => {

    
    const { currentUser } = useAuth();

    console.log("MySpots mounted", currentUser);

    const [savedSpots, setSavedSpots] = useState([]); // saved spots
    const [studySpots, setStudySpots] = useState([]); // All spots from DB
    const [displaySpots, setDisplaySpots] = useState([]); // spots we display
    
    const userId = currentUser?.userId;
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

    const fetchSavedSpots = async() => {

        console.log("Fetching favorites for user ID:", currentUser?.userId);

        try {
            const response = await fetch(`http://localhost:8080/api/favorites/${currentUser.userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("myspots data: ", data);
            setSavedSpots(data);
        } catch (fetchError)
        {
            console.error("Failed to fetch saved spots:", fetchError);
        }
    };

    useEffect(() => {
        if (isOpen && userId) {
            fetchSavedSpots();
        }
    }, [isOpen, userId]);

    useEffect(() => {
      const fetchAllStudySpots = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/studyspots");
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          setStudySpots(data);
        } catch (e) {
          console.error("Failed to fetch all study spots:", e);
        }
      };
      fetchAllStudySpots();
    }, []);

    useEffect(() => {
      if (savedSpots.length > 0 && studySpots.length > 0) {
        const enriched = savedSpots.map((fav) => {
          const spot = studySpots.find((s) => s.locationId === fav.spotId);
          return spot
            ? { ...spot }
            : { name: "Unknown Spot", description: "", locationId: fav.spotId };
        });
        setDisplaySpots(enriched);
      } else {
        setDisplaySpots([]);
      }
    }, [savedSpots, studySpots]);

    return (
        <div style={dashboardStyle} onClick={(e) => e.stopPropagation()}>
            <h2>My Spots</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {displaySpots.length === 0 ? (
                  <li style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    No favorite spots
                  </li>
                ) : (
                  displaySpots.map((spot, index) => (
                    <li
                      key={spot.id || index}
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{fontWeight: 600,  fontSize: '1rem',marginBottom: '4px', }}>
                        {spot.name}
                      </div>
                      <div style={{ fontSize: '0.875rem',}}>
                        {spot.description || "No details"}
                      </div>
                    </li>
                  ))
                )}
            </ul>
        </div>
    );
};