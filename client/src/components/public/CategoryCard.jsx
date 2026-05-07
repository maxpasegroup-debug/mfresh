export default function CategoryCard({ emoji, name, count }) {
  return (
    <article className="reveal rounded-4xl border border-brand-border bg-white p-6 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand-green">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-5xl">
        {emoji}
      </div>
      <h3 className="mt-4 text-lg font-black text-brand-text">{name}</h3>
      <p className="mt-1 text-sm font-bold text-brand-muted">{count} products</p>
    </article>
  );
}
