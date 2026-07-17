import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getAll: () => api.get("/orders"),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
};

export const paymentAPI = {
  process: (data) => api.post("/payments", data),
  createPayPalOrder: (data) => api.post("/payments/paypal/create-order", data),
  capturePayPalOrder: (data) => api.post("/payments/paypal/capture", data),
  confirm: (data) => api.post("/payments/confirm", data),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getEmployees: (params) => api.get("/admin/employees", { params }),
  createEmployee: (data) => api.post("/admin/employees", data),
  updateEmployee: (id, data) => api.put(`/admin/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
  getOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  getPayments: (params) => api.get("/admin/payments", { params }),
};

export default api;
