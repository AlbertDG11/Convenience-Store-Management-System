// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Retrieve authentication token from localStorage
  const token = localStorage.getItem('token');

  // If token exists, render nested routes; otherwise redirect to /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
