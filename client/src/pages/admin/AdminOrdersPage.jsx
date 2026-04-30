import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { ordersApi } from '../../api/orders.api.js';
import { useAdminOrders } from '../../hooks/useAdmin.js';
import { useUiStore } from '../../store/uiStore.js';

const statuses = ['all', 'pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const showToast = useUiStore((state) => state.showToast);
  const [filters, setFilters] = useState({ status: '', search: '', date_from: '', date_to: '', page: 1 });
  const params = useMemo(() => ({ ...filters, status: filters.status || undefined }), [filters]);
  const { orders, total, refetch } = useAdminOrders(params);
  const [selected, setSelected] = useState(null);

  const exportCsv = () => {
    const csv = ['order_number,user_mobile,total,status', ...orders.map((order) => `${order.order_number},${order.user_mobile || ''},${order.total},${order.status}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const forceStatus = async (order, status) => {
    await ordersApi.updateStatus(order.id, status);
    showToast('Order status updated', 'success');
    refetch();
  };

  return (
    <>
      <TopHeader title="All Orders" subtitle={`${total} orders`} variant="dark" rightActions={[{ label: 'Export', icon: 'CSV', onClick: exportCsv }]} />
      <section className="section space-y-4">
        <div className="scroll-row">
          {statuses.map((status) => <button key={status} type="button" onClick={() => setFilters({ ...filters, status: status === 'all' ? '' : status })} className={`rounded-2xl px-4 py-2 text-xs font-black ${filters.status === (status === 'all' ? '' : status) ? 'bg-white text-slate-950' : 'bg-white/10 text-white'}`}>{status.replaceAll('_', ' ')}</button>)}
        </div>
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search order or mobile" className="h-12 w-full rounded-3xl bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-white/50" />
        <div className="grid grid-cols-2 gap-2"><input type="date" onChange={(event) => setFilters({ ...filters, date_from: event.target.value })} className="h-11 rounded-2xl bg-white/10 px-3 text-white" /><input type="date" onChange={(event) => setFilters({ ...filters, date_to: event.target.value })} className="h-11 rounded-2xl bg-white/10 px-3 text-white" /></div>
        {orders.map((order) => (
          <article key={order.id} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
            <div className="flex justify-between"><div><h3 className="font-black">{order.order_number}</h3><p className="text-xs text-white/60">{order.user_name} • {order.user_mobile}</p></div><StatusChip status={order.status} /></div>
            <p className="mt-3 text-sm text-white/60">{order.items_summary || 'Items and vendors involved'}</p>
            <div className="mt-3 flex items-center justify-between"><span className="font-black">₹{order.total}</span><span className="text-xs">{order.payment_status}</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2"><Button size="sm" onClick={() => setSelected(order)}>View Details</Button><select onChange={(event) => forceStatus(order, event.target.value)} value={order.status} className="rounded-2xl bg-white px-2 text-xs font-black text-brand-text">{statuses.filter((s) => s !== 'all').map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </article>
        ))}
        <Button variant="secondary" fullWidth onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next Page</Button>
      </section>
      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.order_number || 'Order'}>
        <pre className="max-h-96 overflow-auto rounded-2xl bg-brand-bg p-3 text-xs">{JSON.stringify(selected, null, 2)}</pre>
      </Modal>
    </>
  );
}
