import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

const publicApi = axios.create({
  baseURL,
  timeout: 15000,
});

const api = axios.create({
  baseURL,
  timeout: 15000,
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('mb_access_token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({ message: 'Network error' });
    }

    const originalRequest = error.config;

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('mb_refresh_token');

    if (!refreshToken) {
      localStorage.removeItem('mb_access_token');
      localStorage.removeItem('mb_refresh_token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(error);
    }

    try {
      refreshPromise =
        refreshPromise ||
        publicApi.post('/api/auth/refresh', {
          refreshToken,
        });
      const response = await refreshPromise;
      refreshPromise = null;

      const nextAccessToken = response.data.accessToken;
      localStorage.setItem('mb_access_token', nextAccessToken);
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      localStorage.removeItem('mb_access_token');
      localStorage.removeItem('mb_refresh_token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(refreshError);
    }
  },
);

export { api, publicApi };
