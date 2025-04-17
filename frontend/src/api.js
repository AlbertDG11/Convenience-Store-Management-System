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

// 2. 导出具体接口：
//    每个函数返回一个 Promise，组件中用 await/then 获取结果

// 登录：传入 { username, password }
export function login(credentials) {
  return api.post('authentication/login/', credentials);
}

// 获取所有订单列表
export function fetchOrders() {
  return api.get('order/orders/');
}

// 创建新订单：data 示例 { items: [...], total: 123 }
export function createOrder(data) {
  return api.post('order/orders/', data);
}

// 获取所有产品
export function fetchProducts() {
  return api.get('product/products/');
}

// 更多接口按需继续添加，例如：
// export function fetchEmployees() { return api.get('employee/employees/'); }