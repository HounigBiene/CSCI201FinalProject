import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [friendOpen, setFriendOpen] = useState(false);
  const toggleFriend = (e) => {
    if (e) e.stopPropagation();
    setFriendOpen(open => !open);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar friendOpen={friendOpen} toggleFriend={toggleFriend} />
        <Routes>
          <Route path="/" element={<MainPage friendOpen={friendOpen} toggleFriend={toggleFriend} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;