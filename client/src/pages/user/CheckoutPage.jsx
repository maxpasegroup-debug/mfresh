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
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

const initialAddress = { label: 'Home', line1: '', line2: '', city: '', pincode: '' };
const deliverySlots = ['Today 4PM - 6PM', 'Today 6PM - 8PM', 'Tomorrow 8AM - 10AM', 'Tomorrow 10AM - 12PM'];

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const showToast = useUiStore((state) => state.showToast);
  const { getItems, getTotal } = useCartStore();
  const { addresses, loading: addressesLoading, refetch } = useAddresses();
  const { create, loading: creatingAddress } = useCreateAddress();
  const { openRazorpay } = useRazorpay();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [deliverySlot, setDeliverySlot] = useState(deliverySlots[0]);
  const [showForm, setShowForm] = useState(false);
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [paying, setPaying] = useState(false);
  const items = getItems();
  const subtotal = Math.round(getTotal());
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
        delivery_slot: deliverySlot,
        offer_code: searchParams.get('offer') || undefined,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          selected_weight: item.selectedWeight || item.product.selectedWeight || '1kg',
          cleaning_option: item.cleaningOption || item.product.cleaningOption || 'cleaned',
          unit_multiplier: Number(item.unitMultiplier || item.product.unitMultiplier || 1),
        })),
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
      <TopHeader title="Checkout" subtitle="Slot, address, payment" />
      <section className="section space-y-4">
        {!items.length ? (
          <EmptyState emoji="Fish" title="Cart is empty" subtitle="Add seafood before checkout." />
        ) : null}

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-black text-brand-text">Delivery Slot</h2>
          <div className="grid grid-cols-2 gap-2">
            {deliverySlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setDeliverySlot(slot)}
                className={`rounded-2xl border px-3 py-3 text-left text-xs font-black ${
                  deliverySlot === slot ? 'border-brand-green bg-green-50 text-brand-green' : 'border-brand-border bg-white text-brand-text'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

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
          {items.map(({ key, product, quantity, selectedWeight, cleaningOption, unitMultiplier }) => {
            const linePrice = Math.round(Number(product.price || 0) * Number(unitMultiplier || product.unitMultiplier || 1));
            return (
              <div key={key || product.id} className="flex justify-between gap-3 text-sm font-bold text-brand-muted">
                <span className="capitalize">
                  {product.name} | {selectedWeight || product.selectedWeight || '1kg'} | {(cleaningOption || product.cleaningOption || 'cleaned').replace('_', ' ')} x {quantity}
                </span>
                <span>Rs {linePrice * quantity}</span>
              </div>
            );
          })}
          <div className="flex justify-between border-t border-brand-border pt-3 text-sm font-bold"><span>Subtotal</span><span>Rs {subtotal}</span></div>
          <div className="flex justify-between text-sm font-bold"><span>Delivery</span><span>Rs {delivery}</span></div>
          <div className="flex justify-between text-xl font-black"><span>Total</span><span>Rs {total}</span></div>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-black">Payment</h2>
          <p className="text-sm font-bold text-brand-muted">UPI, cards, netbanking, and wallets via Razorpay.</p>
          <Button fullWidth loading={paying} onClick={pay}>
            Pay Rs {total}
          </Button>
        </div>
      </section>
    </>
  );
}
