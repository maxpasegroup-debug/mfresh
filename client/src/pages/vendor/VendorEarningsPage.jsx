import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { useVendorDashboard, useVendorOrders } from '../../hooks/useVendorDashboard.js';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

const periods = ['today', 'week', 'month', 'all'];
const barHeights = ['h-8', 'h-14', 'h-10', 'h-24', 'h-16', 'h-20', 'h-12'];

export default function VendorEarningsPage() {
  const vendor = useAuthStore((state) => state.vendor);
  const showToast = useUiStore((state) => state.showToast);
  const { stats } = useVendorDashboard();
  const { orders } = useVendorOrders({ limit: 10 });
  const [period, setPeriod] = useState('month');
  const commissionPct = Number(vendor?.commission_pct || 8);
  const selected = period === 'all' ? { revenue: stats?.month?.revenue || 0, orders: stats?.month?.orders || 0 } : stats?.[period] || { revenue: 0, orders: 0 };
  const commission = Math.round((Number(selected.revenue || 0) * commissionPct) / 100);
  const net = Number(selected.revenue || 0) - commission;

  return (
    <>
      <TopHeader title="Earnings 💰" subtitle="Payouts and commissions" variant="orange" />
      <section className="section space-y-4">
        <div className="card bg-gradient-to-br from-brand-green to-brand-greenLight p-5 text-white">
          <p className="text-sm font-bold text-white/80">This Month</p>
          <h2 className="mt-2 font-display text-5xl font-black">₹{stats?.month?.revenue || 0}</h2>
          <p className="mt-2 text-sm font-black text-white/80">↑18% vs last month</p>
        </div>
        <div className="scroll-row">
          {periods.map((item) => (
            <button key={item} type="button" onClick={() => setPeriod(item)} className={`rounded-2xl px-4 py-2 text-sm font-black capitalize ${period === item ? 'bg-brand-orange text-white' : 'bg-white text-brand-muted'}`}>{item}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Total Revenue', `₹${selected.revenue || 0}`],
            ['Total Orders', selected.orders || 0],
            ['Commission Paid', `₹${commission}`],
            ['Net Earnings', `₹${net}`],
          ].map(([label, value]) => (
            <div key={label} className="card p-4"><p className="text-xl font-black">{value}</p><p className="text-xs font-bold text-brand-muted">{label}</p></div>
          ))}
        </div>
        <div className="card p-5">
          <h2 className="font-display text-2xl font-black">Weekly Revenue</h2>
          <div className="mt-5 flex h-32 items-end gap-2">
            {barHeights.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className={`w-full rounded-t-2xl bg-brand-orange ${height}`} title={`₹${(index + 1) * 250}`} />
                <span className="text-[10px] font-black text-brand-muted">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 text-lg font-black">Recent Payouts</h2>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b border-brand-border py-3 last:border-0">
              <div><p className="font-black">{order.order_number}</p><p className="text-xs text-brand-muted">Net ₹{Math.round(Number(order.total || 0) * (1 - commissionPct / 100))}</p></div>
              <StatusChip status={order.payment_status === 'paid' ? 'delivered' : 'pending'} />
            </div>
          ))}
        </div>
        {net > 0 ? <Button fullWidth onClick={() => showToast('Bank payout details are under review', 'info')}>Request Payout</Button> : null}
      </section>
    </>
  );
}
