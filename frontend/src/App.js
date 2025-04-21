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

import OrderList      from './pages/orders/OrderList';
import OrderForm      from './pages/orders/OrderForm';

import PurchaseList   from './pages/purchases/PurchaseList';
import PurchaseForm   from './pages/purchases/PurchaseForm';

export default function App() {
  return (
    <Routes>
      {/* Redirect plain domain → /customers */}
      <Route path="/" element={<Navigate to="/customers" replace />} />

      {/* Private area (requires login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>

          {/* Customers */}
          <Route path="/customers"            element={<CustomerList />} />
          <Route path="/customers/new"        element={<CustomerForm />} />
          <Route path="/customers/:id/edit"   element={<CustomerForm />} />

          {/* Orders */}
          <Route path="/orders"               element={<OrderList />} />
          <Route path="/orders/new"           element={<OrderForm />} />
          <Route path="/orders/:id/edit"      element={<OrderForm />} />

          {/* Purchases */}
          <Route path="/purchases"            element={<PurchaseList />} />
          <Route path="/purchases/new"        element={<PurchaseForm />} />
          <Route path="/purchases/:id/edit"   element={<PurchaseForm />} />
        </Route>
      </Route>

      {/* Fallback → /customers */}
      <Route path="*" element={<Navigate to="/customers" replace />} />
    </Routes>
  );
}
