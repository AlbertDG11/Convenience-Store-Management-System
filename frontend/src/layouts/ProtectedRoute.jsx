import React from 'react';
import { Navigate } from 'react-router-dom';


export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        padding: '4rem',
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666',
        fontFamily: 'Arial, sans-serif'
      }}>
        You do not have permission to access this page.
      </div>
    );
  }

  return children;
}