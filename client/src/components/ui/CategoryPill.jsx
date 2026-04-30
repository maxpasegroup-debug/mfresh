export default function CategoryPill({ category, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-20 shrink-0 text-center">
      <span
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-3xl text-2xl transition ${
          active ? 'bg-brand-green text-white' : 'bg-white text-brand-text'
        }`}
      >
        {category.emoji || '🥬'}
      </span>
      <span className="mt-2 block truncate text-xs font-bold text-brand-text">{category.name}</span>
    </button>
  );
}
