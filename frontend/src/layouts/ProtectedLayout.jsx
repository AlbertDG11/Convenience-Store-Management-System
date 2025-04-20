// ────────────────────────────────────────────────────────────
// src/layouts/ProtectedLayout.jsx
// ────────────────────────────────────────────────────────────
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function ProtectedLayout() {
  return (
    <>
      <Header />
      <div style={{ display:'flex', height:'calc(100vh - 64px)' }}>
        <Sidebar />
        <main style={{ flex:1, padding:16, overflow:'auto' }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
