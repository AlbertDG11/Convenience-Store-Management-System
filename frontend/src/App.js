// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/orders/OrderList';
import ProductList from './pages/products/ProductList';
import PurchaseList from './pages/purchases/PurchaseList';
import SupplierList from './pages/suppliers/SupplierList';
import CustomerList from './pages/customers/CustomerList';
import EmployeeList from './pages/employees/EmployeeList';
import ReportList from './pages/reports/ReportList';

import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开区：登录 & 注册 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 私有区：用户已登录才能访问 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            {/* 在 ProtectedLayout 的 <Outlet /> 里渲染下面这些 */}
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="purchases" element={<PurchaseList />} />
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="reports" element={<ReportList />} />
          </Route>
        </Route>

        {/* 其余所有地址重定向到 / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
