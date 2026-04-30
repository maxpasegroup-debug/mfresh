import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { ordersApi } from '../../api/orders.api.js';
import { useVendorOrders } from '../../hooks/useVendorDashboard.js';
import { useUiStore } from '../../store/uiStore.js';

const tabs = [
  ['All', undefined],
  ['Pending', 'pending'],
  ['Confirmed', 'confirmed'],
  ['Processing', 'processing'],
  ['Out for Delivery', 'out_for_delivery'],
  ['Delivered', 'delivered'],
];

const actions = {
  pending: ['Confirm', 'confirmed'],
  confirmed: ['Start Processing', 'processing'],
  processing: ['Mark Out for Delivery', 'out_for_delivery'],
  out_for_delivery: ['Mark Delivered', 'delivered'],
};

export default function VendorOrdersPage() {
  const showToast = useUiStore((state) => state.showToast);
  const [tab, setTab] = useState(tabs[0]);
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ status: tab[1], page, limit: 20 }), [tab, page]);
  const { orders, loading, refetch } = useVendorOrders(params);

  const updateStatus = async (order, status) => {
    try {
      await ordersApi.updateStatus(order.id, status);
      showToast('Order updated', 'success');
      refetch();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not update order', 'error');
    }
  };

  return (
    <>
      <TopHeader title="Orders" subtitle="Prepare and dispatch" variant="orange" rightActions={[{ label: 'Refresh', icon: '↻', onClick: refetch }]} />
      <section className="section">
        <div className="scroll-row">
          {tabs.map((item) => (
            <button key={item[0]} type="button" onClick={() => setTab(item)} className={`rounded-2xl px-4 py-2 text-sm font-black ${tab[0] === item[0] ? 'bg-brand-orange text-white' : 'bg-white text-brand-muted'}`}>
              {item[0]}
            </button>
          ))}
        </div>
      </section>
      <section className="section space-y-3">
        {loading ? (
          <SkeletonCard variant="order" />
        ) : orders.length ? (
          orders.map((order) => {
            const action = actions[order.status];
            return (
              <article key={order.id} className="card p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-black">{order.order_number}</h3>
                    <p className="text-xs font-bold text-brand-muted">{order.user_name || 'Customer'}</p>
                  </div>
                  <StatusChip status={order.status} />
                </div>
                <p className="mt-3 text-sm font-semibold text-brand-muted">{order.items_summary || 'Items included'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-black">₹{order.total}</span>
                  <span className="text-xs font-bold text-brand-muted">{order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : ''}</span>
                </div>
                {action ? <Button fullWidth className="mt-3" onClick={() => updateStatus(order, action[1])}>{action[0]}</Button> : <p className="mt-3 text-sm font-black text-brand-green">✅ Delivered</p>}
              </article>
            );
          })
        ) : (
          <div className="card p-5 text-center text-sm font-bold text-brand-muted">No orders found.</div>
        )}
        <Button variant="secondary" fullWidth onClick={() => setPage((value) => value + 1)}>Load More</Button>
      </section>
    </>
  );
}
