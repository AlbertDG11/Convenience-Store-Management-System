// // ────────────────────────────────────────────────────────────
// // src/layouts/ProtectedRoute.jsx
// // ────────────────────────────────────────────────────────────
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
//
// export default function ProtectedRoute() {
//   const token = localStorage.getItem('token'); // simplest auth check
//   return token ? <Outlet /> : <Navigate to="/login" replace />;
// }


// src/layouts/ProtectedRoute.jsx
import React from 'react';
import {Navigate, Outlet } from 'react-router-dom';

// Temporarily bypass authentication checks.
// export default function ProtectedRoute() {
//   return <Outlet />;
// }

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

