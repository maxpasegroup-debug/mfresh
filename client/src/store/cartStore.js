import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function cartItemKey(productId, options = {}) {
  return [
    productId,
    options.selectedWeight || '1kg',
    options.cleaningOption || 'cleaned',
  ].join('::');
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: {},

      addItem: (product, options = {}) =>
        set((state) => {
          const key = cartItemKey(product.id, options);
          const existing = state.items[key];
          const selectedWeight = options.selectedWeight || product.selectedWeight || '1kg';
          const cleaningOption = options.cleaningOption || product.cleaningOption || 'cleaned';
          const unitMultiplier = Number(options.unitMultiplier || product.unitMultiplier || 1);
          return {
            items: {
              ...state.items,
              [key]: {
                key,
                product: { ...product, selectedWeight, cleaningOption, unitMultiplier },
                selectedWeight,
                cleaningOption,
                unitMultiplier,
                quantity: existing ? existing.quantity + 1 : 1,
              },
            },
          };
        }),

      removeItem: (keyOrProductId) =>
        set((state) => {
          const existing = state.items[keyOrProductId];
          if (!existing) return state;

          const nextItems = { ...state.items };
          if (existing.quantity <= 1) {
            delete nextItems[keyOrProductId];
          } else {
            nextItems[keyOrProductId] = { ...existing, quantity: existing.quantity - 1 };
          }

          return { items: nextItems };
        }),

      setQuantity: (keyOrProductId, qty) =>
        set((state) => {
          const existing = state.items[keyOrProductId];
          if (!existing) return state;

          const nextItems = { ...state.items };
          if (qty <= 0) {
            delete nextItems[keyOrProductId];
          } else {
            nextItems[keyOrProductId] = { ...existing, quantity: qty };
          }

          return { items: nextItems };
        }),

      clearCart: () => set({ items: {} }),
      getCount: () =>
        Object.values(get().items).reduce((total, item) => total + Number(item.quantity), 0),
      getTotal: () =>
        Object.values(get().items).reduce(
          (total, item) =>
            total +
            Number(item.product.price || 0) *
              Number(item.unitMultiplier || item.product.unitMultiplier || 1) *
              Number(item.quantity),
          0,
        ),
      getItems: () => Object.values(get().items),
    }),
    {
      name: 'mb_cart',
    },
  ),
);
