import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error(
    "VITE_API_URL is not defined. Create frontend/.env with VITE_API_URL=http://<YOUR_IP>:8000"
  );
}

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
  getDashboard: (params) => api.get("/admin/dashboard", { params }),
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getEmployees: (params) => api.get("/admin/employees", { params }),
  createEmployee: (data) => api.post("/admin/employees", data),
  updateEmployee: (id, data) => api.put(`/admin/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
  getServices: (params) => api.get("/admin/services", { params }),
  getService: (id) => api.get(`/admin/services/${id}`),
  createService: (data) => api.post("/admin/services", data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  uploadServiceImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/admin/services/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getOrders: (params) => api.get("/admin/orders", { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  updateOrderPayment: (id, data) => api.patch(`/admin/orders/${id}/payment`, data),
  getOrderHistory: (id) => api.get(`/admin/orders/${id}/history`),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  getPayments: (params) => api.get("/admin/payments", { params }),
};

export function resolveUploadUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}

export default api;
