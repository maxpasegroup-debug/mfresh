import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: {},

      addItem: (product) =>
        set((state) => {
          const existing = state.items[product.id];
          return {
            items: {
              ...state.items,
              [product.id]: {
                product,
                quantity: existing ? existing.quantity + 1 : 1,
              },
            },
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;

          const nextItems = { ...state.items };
          if (existing.quantity <= 1) {
            delete nextItems[productId];
          } else {
            nextItems[productId] = { ...existing, quantity: existing.quantity - 1 };
          }

          return { items: nextItems };
        }),

      setQuantity: (productId, qty) =>
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;

          const nextItems = { ...state.items };
          if (qty <= 0) {
            delete nextItems[productId];
          } else {
            nextItems[productId] = { ...existing, quantity: qty };
          }

          return { items: nextItems };
        }),

      clearCart: () => set({ items: {} }),
      getCount: () =>
        Object.values(get().items).reduce((total, item) => total + Number(item.quantity), 0),
      getTotal: () =>
        Object.values(get().items).reduce(
          (total, item) => total + Number(item.product.price || 0) * Number(item.quantity),
          0,
        ),
      getItems: () => Object.values(get().items),
    }),
    {
      name: 'mb_cart',
    },
  ),
);
