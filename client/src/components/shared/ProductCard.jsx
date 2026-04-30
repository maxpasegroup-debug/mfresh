import Button from '../ui/Button.jsx';

export default function ProductCard({ name, price, unit }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 h-28 rounded-md bg-gradient-to-br from-green-100 to-orange-100" />
      <h3 className="font-semibold text-ink">{name}</h3>
      <p className="text-sm text-slate-500">{unit}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-ink">₹{price}</span>
        <Button className="px-3 py-1.5">Add</Button>
      </div>
    </article>
  );
}
