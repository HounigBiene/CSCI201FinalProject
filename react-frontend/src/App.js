import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { MySpots } from './components/MySpots';
import { Friend } from './components/Friend';

function App() {
  const [friendOpen, setFriendOpen] = useState(false);
  const [spotsOpen, setSpotsOpen] = useState(false);

  const toggleFriend = (e) => {
    if (e) e.stopPropagation();
    setFriendOpen(open => !open);
    setSpotsOpen(false); // Close spots when opening friends
  };

  const toggleSpots = (e) => {
    if (e) e.stopPropagation();
    setSpotsOpen(open => !open);
    setFriendOpen(false); // Close friends when opening spots
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar 
          friendOpen={friendOpen} 
          toggleFriend={toggleFriend}
          spotsOpen={spotsOpen}
          toggleSpots={toggleSpots}
        />
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Friend isOpen={friendOpen} toggleDashboard={toggleFriend} />
                <MySpots isOpen={spotsOpen} toggleDashboard={toggleSpots} />
                <MainPage 
                  friendOpen={friendOpen} 
                  toggleFriend={toggleFriend}
                  spotsOpen={spotsOpen}
                  toggleSpots={toggleSpots}
                />
              </>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;