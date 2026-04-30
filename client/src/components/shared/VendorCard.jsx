import { memo } from 'react';

function VendorCard({ vendor, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card w-36 shrink-0 p-4 text-left transition active:scale-95"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-brand-bg text-3xl">
        {vendor.logo_url ? (
          <img src={vendor.logo_url} alt={vendor.shop_name} className="h-full w-full object-cover" />
        ) : (
          '🏪'
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 min-h-[40px] text-sm font-black text-brand-text">
        {vendor.shop_name}
      </h3>
      <p className="mt-1 truncate text-xs font-bold text-brand-muted">{vendor.category || 'Fresh store'}</p>
      <div className="mt-3 flex items-center justify-between text-xs font-black">
        <span className="text-brand-orange">★ {Number(vendor.rating || 0).toFixed(1)}</span>
        <span className="text-brand-muted">{vendor.total_orders || 0} orders</span>
      </div>
    </button>
  );
}

export default memo(VendorCard);
