import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  return children; // If user is logged in, render the component they are trying to access
}

export default ProtectedRoute;
