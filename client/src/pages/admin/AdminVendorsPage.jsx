import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { api } from '../../api/http.js';
import { vendorsApi } from '../../api/vendors.api.js';
import { useAdminVendors } from '../../hooks/useAdmin.js';
import { useUiStore } from '../../store/uiStore.js';

const tabs = ['all', 'pending', 'active', 'suspended'];

export default function AdminVendorsPage() {
  const [searchParams] = useSearchParams();
  const showToast = useUiStore((state) => state.showToast);
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const { vendors, loading, refetch } = useAdminVendors({ status: tab, search });
  const filtered = useMemo(
    () =>
      vendors.filter((vendor) => {
        const status = !vendor.is_active ? 'suspended' : vendor.is_approved ? 'active' : 'pending';
        return (tab === 'all' || tab === status) && vendor.shop_name?.toLowerCase().includes(search.toLowerCase());
      }),
    [vendors, tab, search],
  );

  const act = async (vendor, action) => {
    try {
      if (action === 'approve') await vendorsApi.approve(vendor.id);
      else await vendorsApi.suspend(vendor.id, action);
      showToast('Vendor updated', 'success');
      refetch();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not update vendor', 'error');
    }
  };

  return (
    <>
      <TopHeader title="Vendors" subtitle={`${vendors.length} partners`} variant="dark" rightActions={[{ label: 'Onboard', icon: '➕', onClick: () => setModal(true) }]} />
      <section className="section space-y-4">
        <div className="scroll-row">
          {tabs.map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-2xl px-4 py-2 text-sm font-black capitalize ${tab === item ? 'bg-white text-slate-950' : 'bg-white/10 text-white'}`}>{item}</button>)}
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vendors" className="h-12 w-full rounded-3xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-white/50" />
        <div className="space-y-3">
          {loading ? <p className="text-white/60">Loading...</p> : filtered.map((vendor) => {
            const status = !vendor.is_active ? 'suspended' : vendor.is_approved ? 'active' : 'pending';
            return (
              <article key={vendor.id} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
                <div className="flex gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl bg-white/10 text-2xl">{vendor.logo_url ? <img src={vendor.logo_url} alt={vendor.shop_name} className="h-full w-full object-cover" /> : '🏪'}</div>
                  <div className="min-w-0 flex-1"><h3 className="font-black">{vendor.shop_name}</h3><p className="text-xs text-white/60">{vendor.city} • ★ {vendor.rating || 0} • {vendor.total_orders || 0} orders</p></div>
                  <StatusChip status={status === 'active' ? 'delivered' : status === 'pending' ? 'pending' : 'cancelled'} />
                </div>
                <div className="mt-3 flex gap-2">
                  {status === 'pending' ? <><Button size="sm" onClick={() => act(vendor, 'approve')}>Approve</Button><Button size="sm" variant="danger" onClick={() => act(vendor, 'reject')}>Reject</Button></> : null}
                  {status === 'active' ? <Button size="sm" variant="danger" onClick={() => act(vendor, 'suspend')}>Suspend</Button> : null}
                  {status === 'suspended' ? <Button size="sm" onClick={() => act(vendor, 'approve')}>Reactivate</Button> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <OnboardVendorModal isOpen={modal} onClose={() => setModal(false)} onSaved={refetch} />
    </>
  );
}

function OnboardVendorModal({ isOpen, onClose, onSaved }) {
  const showToast = useUiStore((state) => state.showToast);
  const [form, setForm] = useState({ shop_name: '', owner_name: '', mobile: '', category: '', city: '', pincode: '', commission_pct: 8, gst_number: '' });
  const [loading, setLoading] = useState(false);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/api/admin/vendors/onboard', form);
      showToast('Vendor onboarded', 'success');
      onSaved();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not onboard vendor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Onboard Vendor">
      <div className="space-y-3">
        {Object.keys(form).map((key) => <Input key={key} label={key.replaceAll('_', ' ')} value={form[key]} onChange={(event) => set(key, event.target.value)} />)}
        <Button fullWidth loading={loading} onClick={submit}>Create Vendor</Button>
      </div>
    </Modal>
  );
}
