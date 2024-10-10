import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return null; // or a loading spinner

  return user ? (
    children
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />  
  );
};

export default PrivateRoute;
