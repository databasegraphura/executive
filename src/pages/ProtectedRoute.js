// src/pages/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // CORRECTED: Removed '=> {'
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while checking auth status
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Renders the nested route (e.g., DashboardPage wrapped by Layout)
};

export default ProtectedRoute;