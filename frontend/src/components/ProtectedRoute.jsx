import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // 从 localStorage 或 Context 读取登录状态
  const token = localStorage.getItem('token');

  // 有 token 则渲染子路由，否则跳转 /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}