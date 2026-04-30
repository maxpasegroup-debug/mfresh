import { useNavigate, useParams } from 'react-router-dom';
import { ordersApi } from '../../api/orders.api.js';
import OrderTimeline from '../../components/shared/OrderTimeline.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { useOrder } from '../../hooks/useOrders.js';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const addItem = useCartStore((state) => state.addItem);
  const { order, loading, error } = useOrder(id);

  const cancelOrder = async () => {
    try {
      await ordersApi.cancel(id);
      showToast('Order cancelled', 'success');
      navigate('/orders');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel order', 'error');
    }
  };

  const reorder = () => {
    order.items?.forEach((item) => {
      Array.from({ length: Number(item.quantity) }).forEach(() =>
        addItem({
          id: item.product_id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          vendor_name: item.vendor_name,
        }),
      );
    });
    showToast('Items added to cart', 'success');
    navigate('/cart');
  };

  if (loading) {
    return (
      <section className="section space-y-3">
        <SkeletonCard variant="order" />
        <SkeletonCard variant="order" />
      </section>
    );
  }

  if (error || !order) {
    return <EmptyState emoji="📦" title="Order not found" subtitle="This order could not be loaded." />;
  }

  const cancellable = ['pending', 'confirmed'].includes(order.status);

  return (
    <>
      <TopHeader title={`Order ${order.order_number}`} subtitle="Delivery progress" />
      <section className="section space-y-4">
        <div className="card flex items-center justify-between p-4">
          <span className="font-black text-brand-text">Status</span>
          <StatusChip status={order.status} />
        </div>
        <OrderTimeline status={order.status} timestamps={order.timestamps || { pending: order.created_at }} />
        <div className="card p-4">
          <h2 className="mb-3 text-lg font-black">Items</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-brand-border py-3 last:border-0">
              <div>
                <p className="font-black text-brand-text">{item.name}</p>
                <p className="text-xs font-bold text-brand-muted">Qty {item.quantity}</p>
              </div>
              <span className="font-black">₹{item.subtotal || Number(item.price) * Number(item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="card p-4">
          <h2 className="mb-3 text-lg font-black">Payment Summary</h2>
          <div className="flex justify-between text-sm font-bold"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          <div className="flex justify-between text-sm font-bold"><span>Delivery</span><span>₹{order.delivery_fee}</span></div>
          <div className="flex justify-between text-sm font-bold"><span>Discount</span><span>-₹{order.discount_amount}</span></div>
          <div className="mt-3 flex justify-between border-t border-brand-border pt-3 text-xl font-black"><span>Total</span><span>₹{order.total}</span></div>
          <p className="mt-2 text-xs font-bold text-brand-muted">{order.payment_method || 'Razorpay'} • {order.payment_status}</p>
        </div>
        {order.address ? (
          <div className="card p-4">
            <h2 className="text-lg font-black">Delivery Address</h2>
            <p className="mt-2 text-sm font-bold text-brand-muted">{order.address.line1}</p>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          {cancellable ? <Button variant="danger" onClick={cancelOrder}>Cancel Order</Button> : null}
          <Button variant="secondary" onClick={reorder}>Reorder</Button>
        </div>
      </section>
    </>
  );
}
