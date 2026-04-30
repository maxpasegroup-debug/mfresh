const variants = {
  green: 'from-brand-greenDark to-brand-green',
  orange: 'from-brand-orange to-amber-500',
  dark: 'from-[#0f2027] to-[#2c5364]',
};

export default function TopHeader({ title, subtitle, rightActions = [], variant = 'green' }) {
  return (
    <header
      className={`sticky top-0 z-30 bg-gradient-to-br ${variants[variant]} px-4 pb-5 pt-6 text-white`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-white/80">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {rightActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="h-10 w-10 rounded-2xl bg-white/15 text-lg backdrop-blur transition active:scale-95"
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
