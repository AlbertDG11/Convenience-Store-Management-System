// src/App.js
// High‑level routing configuration.  All pages behind authentication are
// wrapped by <ProtectedRoute> (auth guard) and <ProtectedLayout> (header +
// sidebar + <Outlet/>).
// ────────────────────────────────────────────────────────────

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & guard
import ProtectedRoute from './layouts/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayout';

// Feature pages – start minimal with the Customer module
import CustomerList from './pages/customers/CustomerList';
import CustomerForm from './pages/customers/CustomerForm';
import { Login, Employee, SalesReportDashboard, } from './pages';
import Supplier from './pages/supplier'; 
import Product from './pages/product';
import PurchaseReportDashboard from './pages/purchase_report';

export default function App() {
  return (
    <Routes>
      {/* Redirect bare domain → /customers */}
      <Route path="/" element={<Navigate to="/customers" replace />} />

      {/* Protected area */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          {/* Customer management */}
          <Route path="/customers"            element={<CustomerList />} />
          <Route path="/customers/new"        element={<CustomerForm />} />
          <Route path="/customers/:id/edit"   element={<CustomerForm />} />

          {/* TODO: future pages
          <Route path="/orders"    element={<OrderList />} />
          … etc. */}
          <Route path='/' element={<h1>Home</h1>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/employee' element={<Employee/>}/>
          <Route path='/supplier' element={<Supplier />} />
          <Route path='/product'  element={<Product/>} />
          <Route path='/report/sales' element={<SalesReportDashboard/>}/>
          <Route path="/report/purchase" element={<PurchaseReportDashboard />} />
          
        </Route>
      </Route>

      {/* Catch‑all → customers */}
      <Route path="*" element={<Navigate to="/customers" replace />} />
    </Routes>
  );
}
