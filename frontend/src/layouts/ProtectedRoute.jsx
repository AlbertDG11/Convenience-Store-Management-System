// ────────────────────────────────────────────────────────────
// src/layouts/ProtectedRoute.jsx
// ────────────────────────────────────────────────────────────
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token'); // simplest auth check
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
