// src/api.js
// Minimal axios wrapper for this project.
// Only Customer endpoints are implemented now; others can be added in the
// same style later.
// ────────────────────────────────────────────────────────────

import axios from 'axios';

// Base URL comes from .env ⇒ REACT_APP_API_BASE_URL
// Fallback to dev server (Django default) if not provided.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // set to false if you use token‑only auth
});

/* -----------------------------------------------------------
   Auth helpers (optional)
   ---------------------------------------------------------*/
export const login = (credentials) => api.post('auth/login/', credentials);
export const register = (payload)   => api.post('auth/register/', payload);

/* -----------------------------------------------------------
   Customer endpoints
   ---------------------------------------------------------*/
// export const fetchCustomers    = ()          => api.get('customer/customers/');
export const fetchCustomers = () =>
  Promise.resolve({
    data: [
      { id: 1, name: 'Demo A', phone_number: '111‑111', email: 'a@test.com' },
      { id: 2, name: 'Demo B', phone_number: '222‑222', email: 'b@test.com' },
    ],
  });

export const fetchCustomerById = (id)        => api.get(`customer/customers/${id}/`);
export const createCustomer    = (data)      => api.post('customer/customers/', data);
export const updateCustomer    = (id, data)  => api.put(`customer/customers/${id}/`, data);
export const deleteCustomer    = (id)        => api.delete(`customer/customers/${id}/`);

/* -----------------------------------------------------------
   TODO: add other modules in exactly the same fashion
   e.g. fetchOrders, createProduct, etc.
   ---------------------------------------------------------*/

export default api;
