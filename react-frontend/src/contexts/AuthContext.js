import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (userData) => {
      console.log("AuthContext: login called with", userData);
      setIsLoggedIn(true);
      setCurrentUser(userData);
  };

  const logout = () => {
      console.log("AuthContext: logout called");
      setIsLoggedIn(false);
      setCurrentUser(null);
  };

  const value = { isLoggedIn, currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
