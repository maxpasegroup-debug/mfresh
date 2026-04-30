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
  const subtotal = getTotal();
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
        <EmptyState emoji="🧺" title="Your cart is empty" subtitle="Fresh picks are waiting." action="Shop Now" onAction={() => navigate('/shop')} />
      </>
    );
  }

  return (
    <>
      <TopHeader title="My Cart" subtitle={`${items.length} items`} />
      <section className="section space-y-3">
        {items.map(({ product, quantity }) => (
          <article key={product.id} className="card flex gap-3 p-3">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-brand-bg text-4xl">
              {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" /> : product.emoji || '🥬'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-black text-brand-text">{product.name}</h3>
              <p className="text-xs font-bold text-brand-muted">{product.vendor_name || 'Malabarii'} • {product.unit}</p>
              <p className="mt-2 text-sm font-black text-brand-text">₹{product.price} × {quantity}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button type="button" onClick={() => setQuantity(product.id, 0)} className="text-red-600">🗑️</button>
              <div className="flex items-center rounded-2xl bg-brand-green text-white">
                <button type="button" onClick={() => removeItem(product.id)} className="h-8 w-8 font-black">-</button>
                <span className="w-6 text-center text-sm font-black">{quantity}</span>
                <button type="button" onClick={() => addItem(product)} className="h-8 w-8 font-black">+</button>
              </div>
            </div>
          </article>
        ))}

        <PromoCodeInput onApply={applyPromo} discount={discount} loading={promoLoading} />

        <div className="card space-y-3 p-4">
          {delivery === 0 ? <p className="rounded-2xl bg-green-50 p-3 text-sm font-black text-brand-green">Free delivery unlocked</p> : null}
          <div className="flex justify-between text-sm font-bold"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-sm font-bold"><span>Delivery</span><span>₹{delivery}</span></div>
          <div className="flex justify-between text-sm font-bold text-brand-green"><span>Discount</span><span>-₹{discount}</span></div>
          <div className="flex justify-between border-t border-brand-border pt-3 text-xl font-black"><span>Total</span><span>₹{total}</span></div>
          <Button fullWidth onClick={() => navigate(`/checkout${offerCode ? `?offer=${offerCode}` : ''}`)}>
            Proceed to Checkout
          </Button>
        </div>
      </section>
    </>
  );
}
