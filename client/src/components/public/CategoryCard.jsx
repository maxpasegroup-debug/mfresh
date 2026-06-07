export default function CategoryCard({ emoji, name, count }) {
  const isImage = typeof emoji === 'string' && emoji.startsWith('http');

  return (
    <article className="reveal overflow-hidden rounded-4xl border border-brand-border bg-white text-left shadow-card transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand-green">
      <div className="relative h-44 bg-cyan-50">
        {isImage ? (
          <img
            src={emoji}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-black text-brand-green">{emoji}</div>
        )}
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
