export default function PhoneMockup({ compact = false }) {
  const categories = ['🥛', '🥬', '🍎', '🌾'];
  const products = [
    ['🥛', 'Fresh Cow Milk', '₹68', '1 litre'],
    ['🍅', 'Palakkad Tomato', '₹42', '1 kg'],
    ['🥥', 'Coconut Oil', '₹155', '500 ml'],
  ];

  return (
    <div
      className={`relative mx-auto rounded-[2.4rem] border-[10px] border-brand-greenDark bg-brand-greenDark p-2 shadow-2xl ${
        compact ? 'h-[500px] w-[250px]' : 'h-[600px] w-[300px] sm:h-[620px] sm:w-[310px]'
      }`}
    >
      <div className="absolute left-1/2 top-2 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-brand-greenDark" />
      <div className="h-full overflow-hidden rounded-[1.8rem] bg-brand-bg">
        <div className="bg-gradient-to-br from-brand-greenDark to-brand-green px-4 pb-5 pt-8 text-white">
          <p className="text-xs font-bold text-white/75">Delivering to</p>
          <h3 className="font-display text-2xl font-black">Kozhikode</h3>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-brand-muted">
            Search milk, tomato, rice...
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="rounded-3xl bg-gradient-to-br from-brand-orange to-amber-400 p-4 text-white">
            <p className="text-xs font-black uppercase tracking-wide">Morning fresh</p>
            <h4 className="mt-1 font-display text-2xl font-black">Dairy by 7AM</h4>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((icon) => (
              <div key={icon} className="flex h-16 items-center justify-center rounded-3xl bg-white text-2xl shadow-card">
                {icon}
              </div>
            ))}
          </div>
          {products.map(([icon, name, price, unit]) => (
            <div key={name} className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bg text-3xl">
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-brand-text">{name}</p>
                <p className="text-xs font-bold text-brand-muted">{unit}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-brand-text">{price}</p>
                <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-black text-white">Add</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
