import { Link, useNavigate } from 'react-router-dom';
import SeaHeroCanvas from '../../components/public/SeaHeroCanvas.jsx';

const catchItems = [
  ['Seer Fish', 'Premium steak or curry cut', 'Rs 780/kg', 'Today 6PM'],
  ['King Prawns', 'Cleaned or shell-on', 'Rs 640/kg', 'Today 4PM'],
  ['Karimeen', 'Whole or cleaned', 'Rs 520/kg', 'Tomorrow 8AM'],
  ['Squid', 'Cleaned rings', 'Rs 420/kg', 'Today 6PM'],
];

const journey = [
  ['01', 'Catch', 'Morning-sourced seafood from trusted coastal supply.'],
  ['02', 'Clean', 'Whole, cleaned, curry cut, steak cut, or boneless where possible.'],
  ['03', 'Chill Pack', 'Temperature-aware packing built for seafood freshness.'],
  ['04', 'Deliver', 'Slot-based delivery to keep kitchens ready and fish fresh.'],
];

const pickleItems = [
  ['Fish Pickle', 'Malabar masala, slow-cooked oil balance'],
  ['Prawn Pickle', 'Spicy coastal pickle with premium prawns'],
  ['Tuna Pickle', 'Bold, travel-ready, meal-changing flavour'],
];

const trust = ['Fresh Seafood', 'From Malabar Coast', 'Made With Love', 'Fast Delivery', 'Trust & Quality'];

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
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 font-display text-2xl font-black text-white shadow-card">
              M
            </div>
            <div>
              <p className="font-display text-3xl font-black tracking-tight">MFresh</p>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-100">Love From Malabar</p>
            </div>
          </Link>
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

          <div className="sea-glass animate-float-sea rounded-[2rem] p-5 text-brand-text md:p-7">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-green">Live ordering ritual</p>
            <h2 className="mt-3 font-display text-4xl font-black">Pick. Clean. Slot. Cook.</h2>
            <div className="mt-6 grid gap-3">
              {[
                ['Fish', 'Seer Fish'],
                ['Weight', '1kg'],
                ['Cleaning', 'Curry cut'],
                ['Delivery', 'Today 6PM - 8PM'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-white/78 px-4 py-3 shadow-card">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">{label}</span>
                  <span className="font-black text-brand-text">{value}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={onOrder} className="mt-5 w-full rounded-2xl bg-brand-green px-6 py-4 font-black text-white shadow-btn">
              Add Fresh Catch
            </button>
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
        Morning catch confirmed | Hygienic cleaning | Chilled packing | MFresh Pickles exclusive | Same-day seafood slots | Love From Malabar
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
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {catchItems.map(([name, detail, price, slot]) => (
            <article key={name} className="wave-card rounded-3xl border border-brand-border bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-modal">
              <div className="flex h-36 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-100 text-4xl font-black text-brand-green">
                {name.split(' ')[0]}
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
          {pickleItems.map(([name, copy]) => (
            <article key={name} className="rounded-3xl border border-orange-100 bg-white p-5 shadow-card">
              <div className="flex h-40 items-end rounded-3xl bg-gradient-to-br from-orange-100 via-white to-cyan-50 p-4">
                <div className="h-28 w-full rounded-t-[2rem] rounded-b-xl bg-gradient-to-br from-brand-orange to-amber-500 shadow-modal" />
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
