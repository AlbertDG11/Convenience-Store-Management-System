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
// Feature pages – start minimal with the Customer module
import CustomerList from './pages/customers/CustomerList';
import CustomerForm from './pages/customers/CustomerForm';
import { Login, Employee, EmployeeContact, SalesReportDashboard, Profile, Subordinate } from './pages';
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
      {/* Redirect plain domain → /customers */}
      <Route path="/" element={<Navigate to="/customers" replace />} />

      {/* Private area (requires login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>

          {/* Customers */}
          <Route path="/customers"            element={<CustomerList />} />
          <Route path="/customers/new"        element={<CustomerForm />} />
          <Route path="/customers/:id/edit"   element={<CustomerForm />} />

          {/* TODO: future pages
          <Route path="/orders"    element={<OrderList />} />
          … etc. */}
          <Route path='/' element={<h1>Home</h1>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/employee' element={<Employee/>}/>
          <Route path='/contact' element={<EmployeeContact/>}/>
          <Route path='/report/sales' element={<SalesReportDashboard/>}/>
          <Route path="/report/purchase" element={<PurchaseReportDashboard />} />
          <Route path='/inventory'  element={<Inventory/>} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/subordinate' element={<Subordinate/>}/>
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
