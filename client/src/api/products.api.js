import { api, publicApi } from './http';

export const productsApi = {
  list: (params) => publicApi.get('/api/products', { params }),
  getFeatured: () => publicApi.get('/api/products/featured'),
  getById: (id) => publicApi.get(`/api/products/${id}`),
  create: (formData) => api.post('/api/products', formData),
  update: (id, formData) => api.put(`/api/products/${id}`, formData),
  delete: (id) => api.delete(`/api/products/${id}`),
  deleteImage: (id, publicId) => api.delete(`/api/products/${id}/images`, { data: { publicId } }),
};
