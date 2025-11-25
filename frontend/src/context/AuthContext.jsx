import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  // Check local storage for user info when the app loads
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  const value = {
    userInfo,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
