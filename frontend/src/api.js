import axios from 'axios';

// 1. 创建 axios 实例：
//    baseURL: 后端 API 根路径
//    withCredentials: 如果后端用 Cookie/Session，需要携带凭证
//    headers: 默认 JSON 格式
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});



// authentication
// 登录接口：传入 { username, password }，返回 token 或用户信息
export function login(credentials) {
  return api.post('authentication/login/', credentials);
}


// authentication
export function register(data) { return api.post('authentication/register/', data); }

// customer
export function fetchCustomers() { return api.get('customer/customers/'); }
export function createCustomer(data) { return api.post('customer/customers/', data); }
export function updateCustomer(id, data) { return api.put(`customer/customers/${id}/`, data); }
// … deleteCustomer

// employee
export function fetchEmployees() { return api.get('employee/employees/'); }
// … createEmployee, updateEmployee, deleteEmployee

// supplier
export function fetchSuppliers() { return api.get('supplier/suppliers/'); }
// … createSupplier, …

// product
export function fetchProducts() { return api.get('product/products/'); }
// … createProduct, …

// order
export function fetchOrders() { return api.get('order/orders/'); }
// … createOrder, …

// purchase
export function fetchPurchases() { return api.get('purchase/purchases/'); }
// … createPurchase, …

// report
export function fetchReports(params) { return api.get('report/reports/', { params }); }
// 例如按日期、模块维度查询

// 根据需要继续添加其它接口


// order 模块：删除订单
export function deleteOrder(id) {
  return api.delete(`order/orders/${id}/`);
}

