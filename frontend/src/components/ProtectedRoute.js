import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  if (loading) return null; // or a spinner
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute; 