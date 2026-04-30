import { create } from 'zustand';

let toastTimer;

export const useUiStore = create((set) => ({
  toast: null,
  modal: null,

  showToast: (message, type = 'success') => {
    window.clearTimeout(toastTimer);
    set({ toast: { message, type } });
    toastTimer = window.setTimeout(() => set({ toast: null }), 2500);
  },

  hideToast: () => {
    window.clearTimeout(toastTimer);
    set({ toast: null });
  },

  showModal: (name) => set({ modal: name }),
  hideModal: () => set({ modal: null }),
}));
