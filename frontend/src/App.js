// src/App.js
// Top‑level routing.  All private pages live inside <ProtectedRoute>
// and share <ProtectedLayout> (header + sidebar + Outlet).
// ------------------------------------------------------------------
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute   from './layouts/ProtectedRoute';
import ProtectedLayout  from './layouts/ProtectedLayout';

/* ---- Feature pages ---- */
import CustomerList   from './pages/customers/CustomerList';
import CustomerForm   from './pages/customers/CustomerForm';

import { Login, EmployeeContact, SalesReportDashboard, Profile, Subordinate } from './pages';
import Supplier from './pages/supplier';
import Product from './pages/product';
import PurchaseReportDashboard from './pages/purchase_report';
import Inventory from './pages/inventory';

import OrderList      from './pages/orders/OrderList';
import OrderForm      from './pages/orders/OrderForm';

import PurchaseList   from './pages/purchases/PurchaseList';
import PurchaseForm   from './pages/purchases/PurchaseForm';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      
        <Route element={<ProtectedLayout />}>

          {/* After login, go to Profile */}
          {/*<Route index element={<Navigate to="/profile" replace />} />*/}
          <Route path="/profile"       element={<ProtectedRoute><Profile/></ProtectedRoute>} />

          {/* Customers */}
          <Route path="/customers"     element={<ProtectedRoute allowedRoles={[0,2]}><CustomerList /></ProtectedRoute>} />
          <Route path="/customers/new" element={<ProtectedRoute allowedRoles={[0,2]}><CustomerForm /></ProtectedRoute>} />
          <Route path="/customers/:id/edit" element={<ProtectedRoute allowedRoles={[0,2]}><CustomerForm /></ProtectedRoute>} />

          {/* Orders */}
          <Route path="/orders"        element={<ProtectedRoute allowedRoles={[0,2]}><OrderList /></ProtectedRoute>} />
          <Route path="/orders/new"    element={<ProtectedRoute allowedRoles={[0,2]}><OrderForm /></ProtectedRoute>} />
          <Route path="/orders/:id/edit" element={<ProtectedRoute allowedRoles={[0,2]}><OrderForm /></ProtectedRoute>} />

          {/* Purchases */}
          <Route path="/purchases"     element={<ProtectedRoute allowedRoles={[1,2]}><PurchaseList /></ProtectedRoute>} />
          <Route path="/purchases/new" element={<ProtectedRoute allowedRoles={[1,2]}><PurchaseForm /></ProtectedRoute>} />
          <Route path="/purchases/:id/edit" element={<ProtectedRoute allowedRoles={[1,2]}><PurchaseForm /></ProtectedRoute>} />

          {/* Suppliers & Products */}
          <Route path="/supplier"      element={<ProtectedRoute allowedRoles={[1,2]}><Supplier /></ProtectedRoute>} />
          <Route path="/product"       element={<ProtectedRoute><Product /></ProtectedRoute>} />

          {/* Employees */}
          <Route path="/contact"       element={<ProtectedRoute><EmployeeContact /></ProtectedRoute>} />

          {/* Reports */}
          <Route path="/report/sales"    element={<ProtectedRoute allowedRoles={[2]}><SalesReportDashboard /></ProtectedRoute>} />
          <Route path="/report/purchase" element={<ProtectedRoute allowedRoles={[2]}><PurchaseReportDashboard /></ProtectedRoute>} />

          {/* Inventory & Subordinate */}
          <Route path="/inventory"     element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/subordinate"   element={<ProtectedRoute allowedRoles={[2]}><Subordinate /></ProtectedRoute>} />
        </Route>


      {/* Fallback → profile */}
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}
