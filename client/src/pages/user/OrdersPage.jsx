import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';
import OrderCard from '../../components/ui/OrderCard.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import { useOrders } from '../../hooks/useOrders.js';
import { useUiStore } from '../../store/uiStore.js';
import { useEffect } from 'react';

const tabs = [
  { label: 'All', status: undefined },
  { label: 'Active', status: 'confirmed' },
  { label: 'Delivered', status: 'delivered' },
  { label: 'Cancelled', status: 'cancelled' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const [tab, setTab] = useState(tabs[0]);
  const params = useMemo(() => ({ status: tab.status, page: 1, limit: 20 }), [tab]);
  const { orders, total, loading, error, refetch } = useOrders(params);

  useEffect(() => {
    if (error) showToast('Check your connection', 'error');
  }, [error, showToast]);

  return (
    <>
      <TopHeader title="My Orders" subtitle={`${total} orders`} />
      <section className="section">
        <div className="scroll-row">
          {tabs.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-2xl px-4 py-2 text-sm font-black ${
                tab.label === item.label ? 'bg-brand-green text-white' : 'bg-white text-brand-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <section className="section space-y-3">
        <Button variant="secondary" fullWidth onClick={refetch}>Refresh</Button>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} variant="order" />)
        ) : orders.length ? (
          orders.map((order) => <OrderCard key={order.id} order={order} onClick={() => navigate(`/orders/${order.id}`)} />)
        ) : (
          <EmptyState emoji="📦" title="No orders" subtitle="Your order history will appear here." />
        )}
      </section>
    </>
  );
}
