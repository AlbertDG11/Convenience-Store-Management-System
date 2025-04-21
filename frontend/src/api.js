// src/api.js
// Unified Axios wrapper – contains Customer, Order, Purchase endpoints
// ---------------------------------------------------------------------
import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // change to false if you only use token auth
});

/* ---------- Auth (optional) ---------- */
export const login    = creds   => api.post('auth/login/',    creds);
export const register = payload => api.post('auth/register/', payload);

/* ---------- Customer ---------- */
export const fetchCustomers     = ()            => api.get('customer/customers/');
export const fetchCustomerById  = id            => api.get(`customer/customers/${id}/`);
export const createCustomer     = data          => api.post('customer/customers/', data);
export const updateCustomer     = (id, data)    => api.put(`customer/customers/${id}/`, data);
export const deleteCustomer     = id            => api.delete(`customer/customers/${id}/`);

/* ---------- Order ---------- */
export const fetchOrders        = ()            => api.get('order/orders/');
export const fetchOrderById     = id            => api.get(`order/orders/${id}/`);
export const createOrder        = data          => api.post('order/orders/', data);
export const updateOrder        = (id, data)    => api.put(`order/orders/${id}/`, data);
export const deleteOrder        = id            => api.delete(`order/orders/${id}/`);

/* ---------- Purchase ---------- */
export const fetchPurchases     = ()            => api.get('purchase/purchases/');
export const fetchPurchaseById  = id            => api.get(`purchase/purchases/${id}/`);
export const createPurchase     = data          => api.post('purchase/purchases/', data);
export const updatePurchase     = (id, data)    => api.put(`purchase/purchases/${id}/`, data);
export const deletePurchase     = id            => api.delete(`purchase/purchases/${id}/`);

export default api;
