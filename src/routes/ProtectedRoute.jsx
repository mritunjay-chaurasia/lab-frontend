import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};
  