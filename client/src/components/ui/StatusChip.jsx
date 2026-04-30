const colors = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
};

export default function StatusChip({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
        colors[status] || 'bg-slate-100 text-slate-700'
      }`}
    >
      {String(status || 'pending').replaceAll('_', ' ')}
    </span>
  );
}
