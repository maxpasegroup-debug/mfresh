import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import OrderCard from '../../components/ui/OrderCard.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { ordersApi } from '../../api/orders.api.js';
import { useVendorDashboard, useVendorOrders } from '../../hooks/useVendorDashboard.js';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function VendorHomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const vendor = useAuthStore((state) => state.vendor);
  const showToast = useUiStore((state) => state.showToast);
  const { stats, loading } = useVendorDashboard();
  const pendingParams = useMemo(() => ({ status: 'pending', limit: 5 }), []);
  const { orders, loading: ordersLoading, refetch } = useVendorOrders(pendingParams);
  const today = new Date();
  const bars = ['h-10', 'h-16', 'h-8', 'h-24', 'h-14', 'h-20', 'h-12'];

  const markReady = async (id) => {
    try {
      await ordersApi.updateStatus(id, 'processing');
      showToast('Order moved to processing', 'success');
      refetch();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not update order', 'error');
    }
  };

  return (
    <>
      <TopHeader
        title={vendor?.shop_name || 'Vendor'}
        subtitle="Dashboard"
        variant="orange"
        rightActions={[{ label: 'Notifications', icon: '🔔' }]}
      />
      <section className="section space-y-4">
        <div className="card bg-gradient-to-br from-brand-orange to-amber-500 p-5 text-white">
          <h2 className="font-display text-3xl font-black">Good morning, {user?.name || 'Partner'} 👋</h2>
          <p className="mt-2 text-sm font-bold text-white/80">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="scroll-row">
          {[
            ['📦', "Today's Orders", stats?.today?.orders || 0],
            ['✅', 'Delivered Today', stats?.delivered_today || 0],
            ['💰', "Today's Revenue", `₹${stats?.today?.revenue || 0}`],
            ['⭐', 'Rating', Number(stats?.rating || 0).toFixed(1)],
          ].map(([emoji, label, value]) => (
            <div key={label} className="card w-36 shrink-0 p-4">
              <span className="text-2xl">{emoji}</span>
              <p className="mt-3 text-2xl font-black text-brand-text">{loading ? '...' : value}</p>
              <p className="text-xs font-bold text-brand-muted">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black">Pending Orders</h2>
            <button type="button" onClick={() => navigate('/vendor-dashboard/orders')} className="text-xs font-black text-brand-orange">
              See all orders
            </button>
          </div>
          <div className="space-y-3">
            {ordersLoading ? (
              <SkeletonCard variant="order" />
            ) : orders.length ? (
              orders.map((order) => (
                <div key={order.id} className="space-y-2">
                  <OrderCard order={order} />
                  <Button fullWidth onClick={() => markReady(order.id)}>Mark Ready</Button>
                </div>
              ))
            ) : (
              <div className="card p-4 text-sm font-bold text-brand-muted">No pending orders.</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            ['➕', 'Add Product', '/vendor-dashboard/products?add=1'],
            ['📦', 'My Products', '/vendor-dashboard/products'],
            ['💰', 'Earnings', '/vendor-dashboard/earnings'],
            ['👤', 'Profile', '/vendor-dashboard/profile'],
          ].map(([emoji, label, path]) => (
            <button key={label} type="button" onClick={() => navigate(path)} className="card p-5 text-left">
              <span className="text-3xl">{emoji}</span>
              <p className="mt-3 font-black text-brand-text">{label}</p>
            </button>
          ))}
        </div>

        <div className="card p-5">
          <h2 className="font-display text-2xl font-black">This Week</h2>
          <p className="mt-1 text-sm font-bold text-brand-muted">
            {stats?.week?.orders || 0} orders • ₹{stats?.week?.revenue || 0}
          </p>
          <div className="mt-5 flex h-28 items-end gap-2">
            {bars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className={`w-full rounded-t-2xl bg-brand-orange ${height}`} />
                <span className="text-[10px] font-black text-brand-muted">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
