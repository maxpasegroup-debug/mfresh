export default function StatCard({ emoji, value, label, change, changePositive = true }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{emoji}</span>
        {change ? (
          <span className={`rounded-full px-2 py-1 text-xs font-black ${changePositive ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {change}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="text-xs font-bold text-white/60">{label}</p>
    </div>
  );
}
