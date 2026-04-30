import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddressCard from '../../components/shared/AddressCard.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { ordersApi } from '../../api/orders.api.js';
import { useAddresses, useCreateAddress } from '../../hooks/useAddresses.js';
import { useRazorpay } from '../../hooks/useOrders.js';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

const initialAddress = { label: 'Home', line1: '', line2: '', city: '', pincode: '' };

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const showToast = useUiStore((state) => state.showToast);
  const { getItems, getTotal } = useCartStore();
  const { addresses, loading: addressesLoading, refetch } = useAddresses();
  const { create, loading: creatingAddress } = useCreateAddress();
  const { openRazorpay } = useRazorpay();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [paying, setPaying] = useState(false);
  const items = getItems();
  const subtotal = getTotal();
  const delivery = subtotal >= 199 || subtotal === 0 ? 0 : 30;
  const total = subtotal + delivery;
  const activeAddress = selectedAddress || addresses.find((address) => address.is_default)?.id || addresses[0]?.id;

  const saveAddress = async () => {
    try {
      await create(addressForm);
      setAddressForm(initialAddress);
      setShowForm(false);
      await refetch();
      showToast('Address saved', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not save address', 'error');
    }
  };

  const pay = async () => {
    if (!items.length) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (!activeAddress) {
      showToast('Select a delivery address', 'error');
      return;
    }

    setPaying(true);
    try {
      const response = await ordersApi.create({
        address_id: activeAddress,
        offer_code: searchParams.get('offer') || undefined,
        items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      });
      openRazorpay(response.data.razorpay, response.data.order.id);
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not create order', 'error');
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <TopHeader title="Checkout" subtitle="Address and payment" />
      <section className="section space-y-4">
        {!items.length ? (
          <EmptyState emoji="🧺" title="Cart is empty" subtitle="Add products before checkout." />
        ) : null}

        <div className="card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-brand-text">Delivery Address</h2>
            <button type="button" onClick={() => setShowForm((value) => !value)} className="text-sm font-black text-brand-green">
              Add New
            </button>
          </div>
          {addressesLoading ? <p className="text-sm font-bold text-brand-muted">Loading addresses...</p> : null}
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={activeAddress === address.id}
              onSelect={() => setSelectedAddress(address.id)}
            />
          ))}
          {showForm ? (
            <div className="space-y-3">
              {['label', 'line1', 'line2', 'city', 'pincode'].map((field) => (
                <Input
                  key={field}
                  label={field.replace('line', 'Line ')}
                  value={addressForm[field]}
                  onChange={(event) => setAddressForm((current) => ({ ...current, [field]: event.target.value }))}
                />
              ))}
              <Button fullWidth loading={creatingAddress} onClick={saveAddress}>
                Save Address
              </Button>
            </div>
          ) : null}
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-black">Order Summary</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm font-bold text-brand-muted">
              <span>{product.name} × {quantity}</span>
              <span>₹{Number(product.price) * quantity}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-brand-border pt-3 text-sm font-bold"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-sm font-bold"><span>Delivery</span><span>₹{delivery}</span></div>
          <div className="flex justify-between text-xl font-black"><span>Total</span><span>₹{total}</span></div>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-black">Payment</h2>
          <p className="text-sm font-bold text-brand-muted">UPI • Cards • NetBanking • Wallets</p>
          {user?.mode === 'hotel' ? <button type="button" className="w-full rounded-2xl border border-brand-border py-3 text-sm font-black">Pay via Credit</button> : null}
          <Button fullWidth loading={paying} onClick={pay}>
            Pay ₹{total} with Razorpay
          </Button>
        </div>
      </section>
    </>
  );
}
