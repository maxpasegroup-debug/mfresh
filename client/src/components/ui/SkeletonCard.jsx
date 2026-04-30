const variants = {
  product: 'h-64',
  order: 'h-32',
  vendor: 'h-36 w-36 shrink-0',
  banner: 'h-40 w-[300px] shrink-0',
};

export default function SkeletonCard({ variant = 'product' }) {
  return (
    <div className={`${variants[variant]} animate-pulse rounded-3xl border border-brand-border bg-white p-3`}>
      <div className="h-24 rounded-3xl bg-slate-200" />
      <div className="mt-4 h-3 w-2/3 rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-200" />
      <div className="mt-6 h-8 rounded-2xl bg-slate-200" />
    </div>
  );
}
