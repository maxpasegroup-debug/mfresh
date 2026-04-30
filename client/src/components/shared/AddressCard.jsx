export default function AddressCard({ address, selected, onSelect, onEdit, onDelete }) {
  return (
    <article
      className={`rounded-3xl border bg-white p-4 ${
        selected ? 'border-brand-green ring-2 ring-brand-green/10' : 'border-brand-border'
      }`}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-brand-bg px-3 py-1 text-xs font-black text-brand-green">
            {address.label || 'Address'}
          </span>
          {address.is_default ? <span className="text-xs font-black text-brand-orange">Default</span> : null}
        </div>
        <p className="mt-3 text-sm font-bold text-brand-text">{address.line1}</p>
        <p className="mt-1 text-xs font-semibold text-brand-muted">
          {[address.line2, address.city, address.pincode].filter(Boolean).join(', ')}
        </p>
      </button>
      <div className="mt-3 flex gap-3 text-xs font-black text-brand-green">
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" onClick={onDelete} className="text-red-600">
          Delete
        </button>
      </div>
    </article>
  );
}
