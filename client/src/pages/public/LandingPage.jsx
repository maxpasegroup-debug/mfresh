import { Link, useNavigate } from 'react-router-dom';
import SeaHeroCanvas from '../../components/public/SeaHeroCanvas.jsx';

const catchItems = [
  ['Seer Fish', 'Premium steak or curry cut', 'Rs 699/kg', 'Available', 'seer'],
  ['Tiger Prawns', 'Cleaned or shell-on', 'Rs 899/kg', 'Available', 'prawns'],
  ['Karimeen', 'Whole or cleaned', 'Rs 1199/kg', 'Available', 'karimeen'],
  ['Ayala', 'Cleaned or curry cut', 'Rs 249/kg', 'Limited', 'ayala'],
];

const journey = [
  ['01', 'Catch', 'Morning-sourced seafood from trusted coastal supply.'],
  ['02', 'Clean', 'Whole, cleaned, curry cut, steak cut, or boneless where possible.'],
  ['03', 'Chill Pack', 'Temperature-aware packing built for seafood freshness.'],
  ['04', 'Deliver', 'Slot-based delivery to keep kitchens ready and fish fresh.'],
];

const pickleItems = [
  ['Fish Pickle', 'Malabar masala, slow-cooked oil balance', 'fish'],
  ['Prawn Pickle', 'Spicy coastal pickle with premium prawns', 'prawn'],
  ['Tuna Pickle', 'Bold, travel-ready, meal-changing flavour', 'tuna'],
];

const trust = ['Fresh Seafood', 'From Malabar Coast', 'Made With Love', 'Fast Delivery', 'Trust & Quality'];

const freshnessSignals = [
  'Today\'s Catch',
  '4 AM Procurement',
  'Hygienically Cleaned',
  'Chilled Delivery',
  'Same Day Dispatch',
  'Quality Checked',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="bg-brand-bg">
      <Hero onOrder={() => navigate('/auth/mobile')} onCatch={() => navigate('/shop')} />
      <CatchTicker />
      <TodayCatch onShop={() => navigate('/shop')} />
      <Journey />
      <PicklesBrand />
      <ColdChain />
      <TrustStrip />
      <FinalCta />
    </main>
  );
}

function Hero({ onOrder, onCatch }) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-brand-greenDark text-white">
      <SeaHeroCanvas />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-greenDark/30 via-brand-greenDark/20 to-brand-greenDark/88" />
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-between px-4 pb-8 pt-10 lg:px-8">
        <div className="flex justify-end">
          <button type="button" onClick={onCatch} className="hidden rounded-2xl border border-white/35 px-5 py-3 text-sm font-black text-white backdrop-blur md:block">
            Today&apos;s Catch
          </button>
        </div>

        <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-black text-cyan-50 backdrop-blur">
              Direct from coast to kitchen
            </div>
            <h1 className="mt-7 max-w-5xl font-display text-[4rem] font-black leading-[0.86] tracking-tight md:text-8xl lg:text-9xl">
              Fresh from the <span className="sea-text-gradient">sea.</span>
              <br />
              Delivered today.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-cyan-50/86 md:text-xl">
              Choose seafood by weight, select how it should be cleaned, pick a delivery slot, and receive chilled MFresh quality at your door.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onOrder} className="rounded-2xl bg-white px-8 py-4 text-lg font-black text-brand-greenDark shadow-btn">
                Order Fresh Catch
              </button>
              <button type="button" onClick={onCatch} className="rounded-2xl border border-white/40 px-8 py-4 text-lg font-black text-white backdrop-blur">
                Explore the Sea
              </button>
            </div>
          </div>

          <div className="sea-glass rounded-[2rem] p-4 text-brand-text md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-green">Today&apos;s Catch</p>
                <h2 className="mt-2 font-display text-3xl font-black">Order fish now</h2>
              </div>
              <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-black text-white">Live</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {catchItems.map(([name, detail, price, status, visual]) => (
                <article key={name} className="overflow-hidden rounded-3xl bg-white shadow-card">
                  <div className="relative h-28 bg-cyan-50">
                    <SeafoodVisual type={visual} compact />
                    <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-black text-white ${status === 'Limited' ? 'bg-brand-orange' : 'bg-brand-green'}`}>
                      {status}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-black text-brand-text">{name}</h3>
                    <p className="mt-1 text-[11px] font-bold text-brand-muted">{detail}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-brand-greenDark">{price}</span>
                      <button type="button" onClick={onOrder} className="rounded-full bg-brand-green px-3 py-1 text-xs font-black text-white">
                        Order
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatchTicker() {
  return (
    <div className="overflow-hidden bg-white py-4 text-sm font-black uppercase tracking-[0.18em] text-brand-greenDark shadow-card">
      <div className="whitespace-nowrap animate-[marquee_28s_linear_infinite]">
        Today&apos;s Catch | 4 AM Procurement | Hygienically Cleaned | Chilled Delivery | Same Day Dispatch | Quality Checked | MFresh Pickles exclusive
      </div>
    </div>
  );
}

function SeafoodVisual({ type, compact = false }) {
  const isPrawn = type === 'prawns';
  const isKarimeen = type === 'karimeen';
  const isAyala = type === 'ayala';
  const fishTone = isKarimeen
    ? 'from-amber-300 via-cyan-400 to-brand-green'
    : isAyala
      ? 'from-slate-300 via-brand-green to-brand-greenDark'
      : 'from-brand-greenDark via-brand-green to-brand-fresh';

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-100 ${compact ? 'h-full' : 'h-40'}`}>
      <div className="absolute inset-x-0 bottom-0 h-20 animate-wave-drift bg-[radial-gradient(ellipse_at_center,_rgba(0,169,157,0.22),_transparent_64%)]" />
      <div className="absolute left-5 top-4 h-2 w-2 rounded-full bg-white shadow-card" />
      <div className="absolute right-8 top-8 h-3 w-3 rounded-full border border-white/80" />
      {isPrawn ? (
        <div className="absolute left-1/2 top-1/2 h-20 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full border-[12px] border-brand-orange border-l-transparent shadow-modal">
          <span className="absolute -right-8 top-7 h-3 w-10 rounded-full bg-brand-orange" />
          <span className="absolute -left-4 bottom-0 h-7 w-7 rounded-full bg-amber-300" />
          <span className="absolute right-3 top-1 h-2 w-2 rounded-full bg-white" />
        </div>
      ) : (
        <div className={`absolute left-1/2 top-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[55%] bg-gradient-to-r ${fishTone} shadow-modal`}>
          <span className="absolute -left-8 top-1/2 h-12 w-12 -translate-y-1/2 rotate-45 bg-brand-greenDark" />
          <span className="absolute right-8 top-5 h-3 w-3 rounded-full bg-white/90" />
          <span className="absolute left-10 top-1/2 h-1 w-24 -translate-y-1/2 rounded-full bg-white/30" />
          <span className="absolute left-14 top-4 h-4 w-8 rounded-full bg-white/18" />
        </div>
      )}
      <div className="absolute bottom-3 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-brand-greenDark">
        {type}
      </div>
    </div>
  );
}

function PickleJar({ type }) {
  const label =
    {
      fish: 'Fish',
      prawn: 'Prawn',
      tuna: 'Tuna',
    }[type] || 'Pickle';

  return (
    <div className="relative h-40 w-28 animate-float-sea">
      <div className="absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 rounded-t-xl bg-brand-greenDark shadow-card" />
      <div className="absolute inset-x-2 top-5 h-32 overflow-hidden rounded-t-[2rem] rounded-b-xl border border-orange-200 bg-gradient-to-br from-orange-400 via-brand-orange to-amber-500 shadow-modal">
        <div className="absolute inset-x-0 top-0 h-8 bg-white/24" />
        <div className="absolute left-4 top-8 h-4 w-4 rounded-full bg-red-700/55" />
        <div className="absolute right-5 top-14 h-3 w-3 rounded-full bg-yellow-200/65" />
        <div className="absolute left-7 bottom-8 h-5 w-5 rounded-full bg-red-900/35" />
        <div className="absolute inset-x-3 bottom-7 rounded-2xl bg-white px-2 py-2 text-center shadow-card">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-greenDark">MFresh</p>
          <p className="text-xs font-black text-brand-orange">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TodayCatch({ onShop }) {
  return (
    <section className="sea-section px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-green">Today&apos;s fresh catch</p>
            <h2 className="mt-3 font-display text-5xl font-black text-brand-text">Seafood that feels selected, not stocked.</h2>
          </div>
          <button type="button" onClick={onShop} className="rounded-2xl bg-brand-green px-7 py-4 font-black text-white shadow-btn">
            Shop Seafood
          </button>
        </div>
        <div className="mt-8 grid gap-3 rounded-4xl border border-brand-border bg-white p-4 shadow-card md:grid-cols-6">
          {freshnessSignals.map((signal) => (
            <div key={signal} className="rounded-2xl bg-brand-bg px-4 py-3 text-center text-xs font-black uppercase tracking-[0.1em] text-brand-greenDark">
              {signal}
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {catchItems.map(([name, detail, price, slot, visual]) => (
            <article key={name} className="wave-card rounded-3xl border border-brand-border bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-modal">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-100">
                <SeafoodVisual type={visual} />
              </div>
              <h3 className="relative z-10 mt-5 text-xl font-black text-brand-text">{name}</h3>
              <p className="relative z-10 mt-2 min-h-12 text-sm font-bold leading-6 text-brand-muted">{detail}</p>
              <div className="relative z-10 mt-4 flex items-center justify-between">
                <span className="font-black text-brand-greenDark">{price}</span>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-brand-green">{slot}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="bg-brand-greenDark px-4 py-20 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Sea to door journey</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className="font-display text-5xl font-black leading-tight">A delivery experience designed around seafood, not groceries.</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {journey.map(([number, title, copy]) => (
              <article key={number} className="rounded-3xl border border-white/12 bg-white/8 p-6 backdrop-blur">
                <span className="text-sm font-black text-cyan-200">{number}</span>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-white/72">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PicklesBrand() {
  return (
    <section className="bg-[#fff8f0] px-4 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-orange">Exclusive sister brand</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-tight text-brand-text">
            MFresh Pickles. The sea, bottled with Malabar heat.
          </h2>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-brand-muted">
            A separate MFresh pickle line for customers who want coastal flavour beyond fresh catch day: fish, prawn, and tuna pickles packed for repeat orders.
          </p>
          <Link to="/shop?search=pickle" className="mt-8 inline-flex rounded-2xl bg-brand-orange px-8 py-4 font-black text-white shadow-btn">
            Explore Pickles
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pickleItems.map(([name, copy, type], index) => (
            <article key={name} className="pickle-card rounded-3xl border border-orange-100 bg-white p-5 shadow-card" style={{ animationDelay: `${index * 0.25}s` }}>
              <div className="relative flex h-48 items-end justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-white to-cyan-50 p-4">
                <span className="pickle-spice left-6 top-8" />
                <span className="pickle-spice right-8 top-12" />
                <span className="pickle-spice bottom-12 left-12" />
                <PickleJar type={type} />
              </div>
              <h3 className="mt-5 text-xl font-black text-brand-text">{name}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-brand-muted">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ColdChain() {
  return (
    <section className="sea-section px-4 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        {[
          ['Cold Box Ready', 'Chilled packing for freshness-sensitive seafood.'],
          ['Quality Gate', 'Every order is checked before dispatch.'],
          ['Slot Discipline', 'Delivery windows built around cooking time.'],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-3xl border border-brand-border bg-white p-7 shadow-card">
            <h3 className="font-display text-3xl font-black text-brand-text">{title}</h3>
            <p className="mt-4 text-base font-semibold leading-7 text-brand-muted">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-white px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-5">
        {trust.map((item) => (
          <div key={item} className="rounded-2xl border border-brand-border bg-brand-bg px-4 py-5 text-center text-sm font-black uppercase tracking-[0.12em] text-brand-greenDark">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-brand-greenDark px-4 py-20 text-center text-white">
      <h2 className="mx-auto max-w-4xl font-display text-5xl font-black leading-tight">
        Make MFresh the seafood habit your customers remember.
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/72">
        Fresh catch, custom cleaning, delivery slots, and exclusive MFresh Pickles in one coastal commerce platform.
      </p>
      <Link to="/auth/mobile" className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 font-black text-brand-greenDark shadow-btn">
        Start Ordering
      </Link>
    </section>
  );
}
