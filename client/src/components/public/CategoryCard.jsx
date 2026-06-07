export default function CategoryCard({ emoji, name, count }) {
  return (
    <article className="reveal overflow-hidden rounded-4xl border border-brand-border bg-white text-left shadow-card transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand-green">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-100">
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(ellipse_at_center,_rgba(0,169,157,0.22),_transparent_64%)]" />
        <div className="absolute left-1/2 top-1/2 h-20 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[55%] bg-gradient-to-r from-brand-greenDark via-brand-green to-brand-fresh shadow-modal">
          <span className="absolute -left-7 top-1/2 h-12 w-12 -translate-y-1/2 rotate-45 bg-brand-greenDark" />
          <span className="absolute right-7 top-5 h-3 w-3 rounded-full bg-white/85" />
          <span className="absolute left-8 top-1/2 h-1 w-20 -translate-y-1/2 rounded-full bg-white/30" />
        </div>
        <div className="absolute bottom-3 right-4 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-brand-green">
          {emoji}
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-brand-green shadow-card">
          {count}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-black text-brand-text">{name}</h3>
        <p className="mt-1 text-sm font-bold text-brand-muted">Fresh catch selection</p>
      </div>
    </article>
  );
}
