// src/api/index.js
import axios from 'axios';

// Create an axios instance with default settings
//  - baseURL: Backend API base URL
//  - withCredentials: Include credentials for Cookie/Session authentication
//  - headers: Default content type set to JSON
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Authentication endpoints
// Login: Send { username, password }, returns auth token or user info
export function login(credentials) {
  return api.post('authentication/login/', credentials);
}

// Register a new user
export function register(data) {
  return api.post('authentication/register/', data);
}

// Customer endpoints
export function fetchCustomers() {
  return api.get('customer/customers/');
}
export function createCustomer(data) {
  return api.post('customer/customers/', data);
}
export function updateCustomer(id, data) {
  return api.put(`customer/customers/${id}/`, data);
}
export function deleteCustomer(id) {
  return api.delete(`customer/customers/${id}/`);
}

// Employee endpoints
export function fetchEmployees() {
  return api.get('employee/employees/');
}
export function createEmployee(data) {
  return api.post('employee/employees/', data);
}
export function updateEmployee(id, data) {
  return api.put(`employee/employees/${id}/`, data);
}
export function deleteEmployee(id) {
  return api.delete(`employee/employees/${id}/`);
}

// Supplier endpoints
export function fetchSuppliers() {
  return api.get('supplier/suppliers/');
}
export function createSupplier(data) {
  return api.post('supplier/suppliers/', data);
}
export function updateSupplier(id, data) {
  return api.put(`supplier/suppliers/${id}/`, data);
}
export function deleteSupplier(id) {
  return api.delete(`supplier/suppliers/${id}/`);
}

// Product endpoints
export function fetchProducts() {
  return api.get('product/products/');
}
export function createProduct(data) {
  return api.post('product/products/', data);
}
export function updateProduct(id, data) {
  return api.put(`product/products/${id}/`, data);
}
export function deleteProduct(id) {
  return api.delete(`product/products/${id}/`);
}

// Order endpoints
export function fetchOrders() {
  return api.get('order/orders/');
}
export function createOrder(data) {
  return api.post('order/orders/', data);
}
export function updateOrder(id, data) {
  return api.put(`order/orders/${id}/`, data);
}
export function deleteOrder(id) {
  return api.delete(`order/orders/${id}/`);
}

// Purchase endpoints
export function fetchPurchases() {
  return api.get('purchase/purchases/');
}
export function createPurchase(data) {
  return api.post('purchase/purchases/', data);
}
export function updatePurchase(id, data) {
  return api.put(`purchase/purchases/${id}/`, data);
}
export function deletePurchase(id) {
  return api.delete(`purchase/purchases/${id}/`);
}

// Report endpoints
export function fetchReports(params) {
  return api.get('report/reports/', { params });
}

// Add additional API functions as needed
