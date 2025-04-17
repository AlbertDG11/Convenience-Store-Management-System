import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Employee from './pages/employee';
import Dashboard from './pages/index';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />

        {/* 私有路由 */}
        <Route path="/*" element={<ProtectedRoute />}>
          <Route
            path="*"
            element={
              <>
                <Header />
                <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                  <Sidebar />
                  <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
                    {/* 默认首页 */}
                    <Routes>
                      <Route index element={<Dashboard />} />
                      {/* 员工页 */}
                      <Route path="employee" element={<Employee />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}