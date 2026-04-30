import StatusChip from '../ui/StatusChip.jsx';

export default function AdminProductCard({ product, onEdit, onToggleActive, onToggleFeatured, onDelete }) {
  const image = product.images?.[0]?.url || product.image_url;
  return (
    <article className="card overflow-hidden">
      <div className="h-28 bg-brand-bg">
        {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-4xl">🥬</div>}
      </div>
      <div className="space-y-2 p-3">
        <StatusChip status={product.is_active ? 'delivered' : 'cancelled'} />
        <h3 className="line-clamp-2 text-sm font-black text-brand-text">{product.name}</h3>
        <p className="text-xs font-bold text-brand-muted">{product.vendor_name || 'Vendor'} • ₹{product.price}</p>
        <div className="grid grid-cols-2 gap-2 text-xs font-black">
          <button type="button" onClick={onEdit} className="rounded-2xl bg-brand-bg py-2">Edit</button>
          <button type="button" onClick={onToggleFeatured} className="rounded-2xl bg-brand-yellow py-2">⭐</button>
          <button type="button" onClick={onToggleActive} className="rounded-2xl bg-brand-green py-2 text-white">
            {product.is_active ? 'Disable' : 'Enable'}
          </button>
          <button type="button" onClick={onDelete} className="rounded-2xl bg-red-600 py-2 text-white">Delete</button>
        </div>
      </div>
    </article>
  );
}
