import { memo, useCallback, useMemo, useState } from 'react';
import { cartItemKey, useCartStore } from '../../store/cartStore.js';
import Button from './Button.jsx';

const weightOptions = [
  { label: '500g', value: '500g', multiplier: 0.5 },
  { label: '1kg', value: '1kg', multiplier: 1 },
  { label: '2kg', value: '2kg', multiplier: 2 },
];

const cleaningOptions = [
  { label: 'Cleaned', value: 'cleaned' },
  { label: 'Curry cut', value: 'curry_cut' },
  { label: 'Steak cut', value: 'steak_cut' },
  { label: 'Whole fish', value: 'whole' },
];

function ProductCard({ product }) {
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [cleaningOption, setCleaningOption] = useState('cleaned');
  const selectedWeightConfig = weightOptions.find((option) => option.value === selectedWeight) || weightOptions[1];
  const key = useMemo(
    () => cartItemKey(product.id, { selectedWeight, cleaningOption }),
    [cleaningOption, product.id, selectedWeight],
  );
  const quantity = useCartStore((state) => state.items[key]?.quantity || 0);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const add = useCallback(
    () => addItem(product, { selectedWeight, cleaningOption, unitMultiplier: selectedWeightConfig.multiplier }),
    [addItem, cleaningOption, product, selectedWeight, selectedWeightConfig.multiplier],
  );
  const remove = useCallback(() => removeItem(key), [key, removeItem]);
  const discount =
    product.mrp && product.price
      ? Math.max(0, Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100))
      : 0;
  const image = product.images?.[0]?.url || product.image_url;
  const displayPrice = Math.round(Number(product.price || 0) * selectedWeightConfig.multiplier);

  return (
    <article className="card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-modal">
      <div className="relative h-32 bg-gradient-to-br from-cyan-50 via-white to-blue-100">
        {discount > 0 ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-orange px-2 py-1 text-[10px] font-black text-white">
            {discount}% OFF
          </span>
        ) : null}
        <span className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-brand-green shadow-card">
          MFresh
        </span>
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-black text-brand-green">Catch</div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-bold text-brand-muted">Freshness checked</p>
        <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-black text-brand-text">{product.name}</h3>
        <p className="mt-1 text-xs font-bold text-brand-muted">Price per kg | cleaned to order</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <select
            value={selectedWeight}
            onChange={(event) => setSelectedWeight(event.target.value)}
            className="h-9 rounded-2xl border border-brand-border bg-white px-2 text-xs font-black text-brand-text outline-none"
          >
            {weightOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={cleaningOption}
            onChange={(event) => setCleaningOption(event.target.value)}
            className="h-9 rounded-2xl border border-brand-border bg-white px-2 text-xs font-black text-brand-text outline-none"
          >
            {cleaningOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-black text-brand-text">Rs {displayPrice}</span>
            {product.mrp ? (
              <span className="ml-1 text-xs font-bold text-brand-muted line-through">
                Rs {Math.round(Number(product.mrp) * selectedWeightConfig.multiplier)}
              </span>
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
