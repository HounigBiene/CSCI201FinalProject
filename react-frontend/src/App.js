import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import { Navbar } from './components/Navbar';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Routes>
        {/* Set MainPage as the default landing page */}
        <Route path="/" element={<MainPage />} />

        {/* Keep login and signup routes*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Catch any other routes and redirect to main page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
