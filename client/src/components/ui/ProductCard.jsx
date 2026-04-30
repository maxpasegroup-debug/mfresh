import { memo, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import Button from './Button.jsx';

function ProductCard({ product }) {
  const user = useAuthStore((state) => state.user);
  const quantity = useCartStore((state) => state.items[product.id]?.quantity || 0);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const add = useCallback(() => addItem(product), [addItem, product]);
  const remove = useCallback(() => removeItem(product.id), [removeItem, product.id]);
  const discount =
    product.mrp && product.price
      ? Math.max(0, Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100))
      : 0;
  const image = product.images?.[0]?.url || product.image_url;
  const hotelMode = user?.mode === 'hotel';

  return (
    <article className="card overflow-hidden">
      <div className="relative h-32 bg-brand-bg">
        {discount > 0 ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-orange px-2 py-1 text-[10px] font-black text-white">
            {discount}% OFF
          </span>
        ) : null}
        {hotelMode ? (
          <span className="absolute right-2 top-2 z-10 rounded-full bg-brand-yellow px-2 py-1 text-[10px] font-black text-brand-text">
            Bulk
          </span>
        ) : null}
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{product.emoji || '🥬'}</div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-bold text-brand-muted">{product.vendor_name || 'Malabarii'}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-black text-brand-text">{product.name}</h3>
        <p className="mt-1 text-xs text-brand-muted">{product.unit}</p>
        {hotelMode && product.bulk_price ? (
          <p className="mt-1 text-xs font-black text-brand-orange">Bulk: ₹{product.bulk_price}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-black text-brand-text">₹{product.price}</span>
            {product.mrp ? (
              <span className="ml-1 text-xs font-bold text-brand-muted line-through">₹{product.mrp}</span>
            ) : null}
          </div>
          {quantity > 0 ? (
            <div className="flex items-center rounded-2xl bg-brand-green text-white">
              <button type="button" onClick={remove} className="h-8 w-8 text-lg font-black">
                -
              </button>
              <span className="w-6 text-center text-sm font-black">{quantity}</span>
              <button type="button" onClick={add} className="h-8 w-8 text-lg font-black">
                +
              </button>
            </div>
          ) : (
            <Button size="sm" onClick={add}>
              Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
