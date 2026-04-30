import { api, publicApi } from './http';

export const authApi = {
  sendOtp: (mobile, purpose) => publicApi.post('/api/auth/send-otp', { mobile, purpose }),
  verifyOtp: (mobile, otp, purpose) =>
    publicApi.post('/api/auth/verify-otp', { mobile, otp, purpose }),
  setPin: (name, pin, mode, otpToken) =>
    publicApi.post(
      '/api/auth/set-pin',
      { name, pin, mode },
      { headers: { Authorization: `Bearer ${otpToken}` } },
    ),
  loginWithPin: (mobile, pin, otpToken) =>
    publicApi.post(
      '/api/auth/login',
      { mobile, pin },
      { headers: { Authorization: `Bearer ${otpToken}` } },
    ),
  resetPin: (pin, otpToken) =>
    publicApi.post(
      '/api/auth/reset-pin',
      { pin },
      { headers: { Authorization: `Bearer ${otpToken}` } },
    ),
  refresh: (refreshToken) => publicApi.post('/api/auth/refresh', { refreshToken }),
  getMe: () => api.get('/api/auth/me'),
};
