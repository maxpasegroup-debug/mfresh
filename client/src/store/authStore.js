import { create } from 'zustand';
import { authApi } from '../api/auth.api';

const initialState = {
  user: null,
  vendor: null,
  accessToken: null,
  isLoading: false,
  isInitialized: false,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  initialize: async () => {
    const token = localStorage.getItem('mb_access_token');

    if (!token) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true, accessToken: token });

    try {
      const response = await authApi.getMe();
      set({
        user: response.data.user,
        vendor: response.data.vendor || null,
        accessToken: token,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('mb_access_token');
        localStorage.removeItem('mb_refresh_token');
      }
      set({ ...initialState, isInitialized: true });
    }
  },

  loginSuccess: ({ user, accessToken, refreshToken, vendor }) => {
    localStorage.setItem('mb_access_token', accessToken);
    localStorage.setItem('mb_refresh_token', refreshToken);
    set({ user, vendor: vendor || null, accessToken, isLoading: false, isInitialized: true });
  },

  logout: () => {
    localStorage.removeItem('mb_access_token');
    localStorage.removeItem('mb_refresh_token');
    set({ ...initialState, isInitialized: true });

    if (window.location.pathname !== '/auth/mobile') {
      window.location.assign('/auth/mobile');
    }
  },

  updateUser: (data) => {
    const user = get().user;
    set({ user: user ? { ...user, ...data } : user });
  },

  switchMode: (mode) => {
    if (!['individual', 'hotel'].includes(mode)) return;
    const user = get().user;
    set({ user: user ? { ...user, mode } : user });
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => useAuthStore.getState().logout());
}
