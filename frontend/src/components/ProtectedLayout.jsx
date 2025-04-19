// src/components/ProtectedLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function ProtectedLayout() {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          padding: 16,
          overflow: 'auto'
        }}>
          {/* Rendered by Outlet: Dashboard, OrderList, CustomerList, etc. */}
          <Outlet />
        </div>
      </div>
    </>
  );
}