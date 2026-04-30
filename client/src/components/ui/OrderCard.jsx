import { memo } from 'react';
import Button from './Button.jsx';
import StatusChip from './StatusChip.jsx';

function OrderCard({ order, onClick }) {
  const date = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '';

  return (
    <article className="card p-4">
      <button type="button" onClick={onClick} className="block w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-brand-text">{order.order_number}</h3>
            <p className="text-xs font-semibold text-brand-muted">{date}</p>
          </div>
          <StatusChip status={order.status} />
        </div>
        <p className="mt-3 line-clamp-1 text-sm text-brand-muted">
          {order.items_summary || `${order.items?.length || 0} items`}
        </p>
      </button>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-black text-brand-text">₹{order.total}</span>
        <Button variant="secondary" size="sm">
          Reorder
        </Button>
      </div>
    </article>
  );
}

export default memo(OrderCard);
