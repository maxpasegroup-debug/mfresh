import EmptyState from '../ui/EmptyState.jsx';
import SkeletonCard from '../ui/SkeletonCard.jsx';

export default function DataTable({ columns, data, loading, emptyMessage = 'No records found' }) {
  if (loading) return <SkeletonCard variant="order" />;
  if (!data.length) return <EmptyState emoji="📋" title={emptyMessage} />;

  return (
    <div className="space-y-3">
      {data.map((row) => (
        <article key={row.id || row.order_number} className="card p-4">
          {columns.map((column) => (
            <div key={column.key} className="flex justify-between gap-3 py-1 text-sm">
              <span className="font-bold text-brand-muted">{column.label}</span>
              <span className="text-right font-black text-brand-text">
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </span>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
