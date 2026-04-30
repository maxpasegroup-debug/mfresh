import { api, publicApi } from './http';

export const categoriesApi = {
  list: () => publicApi.get('/api/categories'),
  getById: (id) => publicApi.get(`/api/categories/${id}`),
  create: (formData) => api.post('/api/categories', formData),
  update: (id, formData) => api.put(`/api/categories/${id}`, formData),
  delete: (id) => api.delete(`/api/categories/${id}`),
};
