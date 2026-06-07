import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { useAdminStats } from '../../hooks/useAdmin.js';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { stats, loading } = useAdminStats();
  const pending = stats?.pending_vendor_approvals || 0;

  return (
    <>
      <TopHeader title="Admin Panel" subtitle="MFresh Control Centre" variant="dark" />
      <section className="section space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard emoji="📦" value={loading ? '...' : stats?.total_orders || 0} label="Total Orders" change={`Today ${stats?.today?.orders || 0}`} />
          <StatCard emoji="💰" value={`₹${stats?.total_revenue || 0}`} label="Revenue" change={`Week ₹${stats?.week?.revenue || 0}`} />
          <StatCard emoji="🏪" value={stats?.total_vendors || 0} label="Active Vendors" change={`${pending} pending`} />
          <StatCard emoji="👤" value={stats?.total_users || 0} label="Total Users" change="Live" />
        </div>
        {pending ? (
          <button type="button" onClick={() => navigate('/admin/vendors?tab=pending')} className="w-full rounded-3xl bg-brand-orange p-4 text-left font-black text-white">
            ⚠️ {pending} vendors waiting for approval
          </button>
        ) : null}
        <div className="grid grid-cols-3 gap-3">
          {[
            ['🏪', 'Vendors', '/admin/vendors'],
            ['📂', 'Categories', '/admin/categories'],
            ['🛍️', 'Products', '/admin/products'],
            ['📋', 'Orders', '/admin/orders'],
            ['🎁', 'Offers', '/admin/offers'],
            ['⚙️', 'Settings', '/admin/settings'],
          ].map(([emoji, label, path]) => (
            <button key={label} type="button" onClick={() => navigate(path)} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
              <span className="text-2xl">{emoji}</span><p className="mt-2 text-xs font-black">{label}</p>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
          <h2 className="mb-3 text-lg font-black">Recent Orders</h2>
          {(stats?.recent_orders || []).map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b border-white/10 py-3 last:border-0">
              <div><p className="font-black">{order.order_number}</p><p className="text-xs text-white/60">{order.user_name || order.user_mobile}</p></div>
              <div className="text-right"><p className="font-black">₹{order.total}</p><StatusChip status={order.status} /></div>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
          <h2 className="mb-3 text-lg font-black">Top Vendors</h2>
          {['Fresh Dairy Hub', 'Green Basket', 'Hotel Supply Co'].map((name, index) => (
            <div key={name} className="flex justify-between py-2 text-sm font-bold"><span>{index + 1}. {name}</span><span>₹{(3 - index) * 12000}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}
