import { api, publicApi } from './http';

export const vendorsApi = {
  list: () => publicApi.get('/api/vendors'),
  getById: (id) => publicApi.get(`/api/vendors/${id}`),
  getMe: () => api.get('/api/vendors/me'),
  getDashboard: () => api.get('/api/vendors/dashboard'),
  onboard: (formData) => api.post('/api/vendors/onboard', formData),
  update: (id, formData) => api.put(`/api/vendors/${id}`, formData),
  approve: (id) => api.patch(`/api/vendors/${id}/approve`),
  suspend: (id, reason) => api.patch(`/api/vendors/${id}/suspend`, { reason }),
};
