import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { api } from '../../api/http.js';
import { useUiStore } from '../../store/uiStore.js';

const blank = {
  title: '',
  type: 'promo_code',
  code: '',
  discount_pct: '',
  discount_flat: '',
  min_order_value: 0,
  max_discount: '',
  applies_to: 'all',
  valid_from: '',
  valid_to: '',
  usage_limit: '',
  is_active: true,
};

export default function AdminOffersPage() {
  const showToast = useUiStore((state) => state.showToast);
  const [offers, setOffers] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchOffers = useCallback(
    () => api.get('/api/offers').then((response) => setOffers(response.data.offers || [])),
    [],
  );
  useEffect(() => {
    fetchOffers().catch(() => showToast('Could not load offers', 'error'));
  }, [fetchOffers, showToast]);

  const remove = async (offer) => {
    await api.delete(`/api/offers/${offer.id}`);
    showToast('Offer deleted', 'success');
    fetchOffers();
  };

  const toggle = async (offer) => {
    await api.put(`/api/offers/${offer.id}`, { ...offer, is_active: !offer.is_active });
    fetchOffers();
  };

  return (
    <>
      <TopHeader title="Offers & Promotions 🎁" subtitle="Discounts and campaigns" variant="dark" rightActions={[{ label: 'Create', icon: '➕', onClick: () => setEditing(blank) }]} />
      <section className="section space-y-3">
        {offers.map((offer) => (
          <article key={offer.id} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
            <div className="flex justify-between"><div><h3 className="font-black">{offer.title}</h3><p className="text-xs text-white/60">{offer.code || offer.type}</p></div><StatusChip status={offer.is_active ? 'delivered' : 'cancelled'} /></div>
            <p className="mt-3 text-sm font-bold">Discount: {offer.discount_pct ? `${offer.discount_pct}%` : `₹${offer.discount_flat || 0}`}</p>
            <p className="text-xs text-white/60">Usage {offer.usage_count || 0}/{offer.usage_limit || '∞'}</p>
            <div className="mt-3 grid grid-cols-3 gap-2"><Button size="sm" onClick={() => toggle(offer)}>{offer.is_active ? 'Disable' : 'Enable'}</Button><Button size="sm" variant="secondary" onClick={() => setEditing(offer)}>Edit</Button><Button size="sm" variant="danger" onClick={() => remove(offer)}>Delete</Button></div>
          </article>
        ))}
      </section>
      <OfferModal offer={editing} isOpen={Boolean(editing)} onClose={() => setEditing(null)} onSaved={fetchOffers} />
    </>
  );
}

function OfferModal({ offer, isOpen, onClose, onSaved }) {
  const showToast = useUiStore((state) => state.showToast);
  const [form, setForm] = useState(blank);

  useEffect(() => setForm(offer || blank), [offer]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    if (form.id) await api.put(`/api/offers/${form.id}`, form);
    else await api.post('/api/offers', form);
    showToast('Offer saved', 'success');
    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={form.id ? 'Edit Offer' : 'Create Offer'}>
      <div className="space-y-3">
        <Input label="Title" value={form.title || ''} onChange={(event) => set('title', event.target.value)} />
        <select value={form.type} onChange={(event) => set('type', event.target.value)} className="h-12 w-full rounded-2xl border border-brand-border px-3 font-bold">
          <option value="flash_sale">Flash Sale</option><option value="festival">Festival</option><option value="free_delivery">Free Delivery</option><option value="promo_code">Promo Code</option>
        </select>
        <Input label="Code" value={form.code || ''} onChange={(event) => set('code', event.target.value.toUpperCase())} />
        <div className="grid grid-cols-2 gap-2"><Input label="Discount %" value={form.discount_pct || ''} onChange={(event) => set('discount_pct', event.target.value)} /><Input label="Flat ₹" value={form.discount_flat || ''} onChange={(event) => set('discount_flat', event.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2"><Input label="Min order" value={form.min_order_value || ''} onChange={(event) => set('min_order_value', event.target.value)} /><Input label="Max discount" value={form.max_discount || ''} onChange={(event) => set('max_discount', event.target.value)} /></div>
        <select value={form.applies_to} onChange={(event) => set('applies_to', event.target.value)} className="h-12 w-full rounded-2xl border border-brand-border px-3 font-bold"><option value="all">All</option><option value="category">Category</option><option value="vendor">Vendor</option><option value="product">Product</option></select>
        <div className="grid grid-cols-2 gap-2"><Input type="datetime-local" label="Valid from" value={form.valid_from || ''} onChange={(event) => set('valid_from', event.target.value)} /><Input type="datetime-local" label="Valid to" value={form.valid_to || ''} onChange={(event) => set('valid_to', event.target.value)} /></div>
        <Input label="Usage limit" value={form.usage_limit || ''} onChange={(event) => set('usage_limit', event.target.value)} />
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => set('is_active', event.target.checked)} /> Active</label>
        <Button fullWidth onClick={save}>Save Offer</Button>
      </div>
    </Modal>
  );
}
