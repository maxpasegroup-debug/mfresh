export default function BottomNav({ items, active, onSelect }) {
  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-brand-border bg-white px-2 pt-2 shadow-card">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const isActive = active === item.path || active.startsWith(`${item.path}/`);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition ${
                isActive ? 'scale-105 text-brand-green' : 'text-brand-muted'
              }`}
            >
              {isActive ? (
                <span className="absolute top-0 h-1 w-8 rounded-b-full bg-brand-orange" />
              ) : null}
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge ? (
                <span className="absolute right-2 top-1 rounded-full bg-brand-orange px-1.5 text-[10px] text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
