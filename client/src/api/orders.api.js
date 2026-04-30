import { api } from './http';

export const ordersApi = {
  create: (data) => api.post('/api/orders', data),
  verifyPayment: (id, data) => api.post(`/api/orders/${id}/verify-payment`, data),
  list: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  cancel: (id) => api.post(`/api/orders/${id}/cancel`),
  getVendorOrders: (params) => api.get('/api/orders/vendor', { params }),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
};
