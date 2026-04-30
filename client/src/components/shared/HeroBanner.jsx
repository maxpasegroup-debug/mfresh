import { memo } from 'react';

function HeroBanner({ title, tag, emoji, gradient = 'from-brand-green to-brand-greenLight', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-40 w-[300px] shrink-0 rounded-4xl bg-gradient-to-br ${gradient} p-5 text-left text-white shadow-card`}
    >
      <div className="flex h-full items-center justify-between gap-4">
        <div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">{tag}</span>
          <h3 className="mt-4 font-display text-2xl font-black leading-tight">{title}</h3>
        </div>
        <span className="text-6xl">{emoji}</span>
      </div>
    </button>
  );
}

export default memo(HeroBanner);
