import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/http.js';
import PromoCodeInput from '../../components/shared/PromoCodeInput.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function CartPage() {
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const { getItems, getTotal, addItem, removeItem, setQuantity } = useCartStore();
  const [discount, setDiscount] = useState(0);
  const [offerCode, setOfferCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const items = getItems();
  const subtotal = Math.round(getTotal());
  const delivery = subtotal >= 199 || subtotal === 0 ? 0 : 30;
  const total = Math.max(subtotal + delivery - discount, 0);

  const applyPromo = async (code) => {
    if (!code) throw new Error('Enter a promo code');
    setPromoLoading(true);
    try {
      const response = await publicApi.get('/api/offers', { params: { code } });
      const offer = response.data.offer || response.data.offers?.[0];
      if (!offer) throw new Error('Invalid promo code');
      const nextDiscount = offer.discount_flat || Math.round((subtotal * Number(offer.discount_pct || 0)) / 100);
      setOfferCode(code);
      setDiscount(Math.min(nextDiscount, offer.max_discount || nextDiscount));
    } catch (error) {
      showToast(error.response?.data?.message || 'Invalid promo code', 'error');
      throw new Error('Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  if (!items.length) {
    return (
      <>
        <TopHeader title="My Cart" subtitle="0 items" />
        <EmptyState emoji="Fish" title="Your cart is empty" subtitle="Fresh seafood is waiting." action="Shop Now" onAction={() => navigate('/shop')} />
      </>
    );
  }

  return (
    <>
      <TopHeader title="My Cart" subtitle={`${items.length} seafood items`} />
      <section className="section space-y-3">
        {items.map(({ key, product, quantity, selectedWeight, cleaningOption, unitMultiplier }) => {
          const lineKey = key || product.id;
          const linePrice = Math.round(Number(product.price || 0) * Number(unitMultiplier || product.unitMultiplier || 1));
          return (
            <article key={lineKey} className="card flex gap-3 p-3">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-brand-bg text-lg font-black text-brand-green">
                {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" /> : 'Fish'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-black text-brand-text">{product.name}</h3>
                <p className="text-xs font-bold capitalize text-brand-muted">
                  {selectedWeight || product.selectedWeight || '1kg'} | {(cleaningOption || product.cleaningOption || 'cleaned').replace('_', ' ')}
                </p>
                <p className="mt-2 text-sm font-black text-brand-text">Rs {linePrice} x {quantity}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button type="button" onClick={() => setQuantity(lineKey, 0)} className="text-xs font-black text-red-600">Remove</button>
                <div className="flex items-center rounded-2xl bg-brand-green text-white">
                  <button type="button" onClick={() => removeItem(lineKey)} className="h-8 w-8 font-black">-</button>
                  <span className="w-6 text-center text-sm font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => addItem(product, { selectedWeight, cleaningOption, unitMultiplier })}
                    className="h-8 w-8 font-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <PromoCodeInput onApply={applyPromo} discount={discount} loading={promoLoading} />

        <div className="card space-y-3 p-4">
          {delivery === 0 ? <p className="rounded-2xl bg-green-50 p-3 text-sm font-black text-brand-green">Free delivery unlocked</p> : null}
          <div className="flex justify-between text-sm font-bold"><span>Subtotal</span><span>Rs {subtotal}</span></div>
          <div className="flex justify-between text-sm font-bold"><span>Delivery</span><span>Rs {delivery}</span></div>
          <div className="flex justify-between text-sm font-bold text-brand-green"><span>Discount</span><span>-Rs {discount}</span></div>
          <div className="flex justify-between border-t border-brand-border pt-3 text-xl font-black"><span>Total</span><span>Rs {total}</span></div>
          <Button fullWidth onClick={() => navigate(`/checkout${offerCode ? `?offer=${offerCode}` : ''}`)}>
            Choose Delivery Slot
          </Button>
        </div>
      </section>
    </>
  );
}
