// src/api.js
// Unified Axios wrapper
// ---------------------------------------------------------------------
import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // change to false if you only use token auth
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
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

/* ---------- CustomerAddress ---------- */
export const fetchCustomerAddresses = () =>
  api.get('customer/customer-addresses/');
export const createCustomerAddress = data =>
  api.post('customer/customer-addresses/', data);
export const updateCustomerAddress = (id, data) =>
  api.put(`customer/customer-addresses/${id}/`, data);
export const deleteCustomerAddress = id =>
  api.delete(`customer/customer-addresses/${id}/`);
export const fetchAddressesByMembershipId = membershipId =>
  api.get(`customer/customer-addresses/?membership_id=${membershipId}`);

/* ---------- Order ---------- */
export const fetchOrders        = ()            => api.get('order/orders/');
export const fetchOrderById     = id            => api.get(`order/orders/${id}/`);
export const createOrder        = data          => api.post('order/orders/', data);
export const updateOrder        = (id, data)    => api.put(`order/orders/${id}/`, data);
export const cancelOrder        = id            => api.post(`order/orders/${id}/cancel/`);
/* ---------- Purchase ---------- */
export const fetchPurchases     = ()            => api.get('purchase/purchases/');
export const fetchPurchaseById  = id            => api.get(`purchase/purchases/${id}/`);
export const createPurchase     = data          => api.post('purchase/purchases/', data);
export const updatePurchase     = (id, data)    => api.put(`purchase/purchases/${id}/`, data);
export const deletePurchase     = id            => api.delete(`purchase/purchases/${id}/`);



export const fetchProducts      = ()         => api.get('product/products/');
export default api;
