import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  ['1', 'Apply online', 'Share your business details and product category.'],
  ['2', 'Vendor check', 'Our team verifies licenses, bank details, and serviceability.'],
  ['3', 'Catalog setup', 'Upload photos, pricing, stock, and delivery preferences.'],
  ['4', 'Start selling', 'Receive orders, track sales, and get weekly payouts.'],
];

export default function VendorPage() {
  const [sales, setSales] = useState(100000);
  const earnings = useMemo(() => Math.round(sales * 0.92), [sales]);

  return (
    <main>
      <section className="bg-gradient-to-br from-white via-green-50 to-brand-bg px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-brand-green shadow-card">Sell With Us</span>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black leading-tight text-brand-text md:text-6xl">
            Grow Your Business with Malabarii
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted">Reach 10,000+ customers in Kerala with fast ordering, secure payouts, and real-time sales visibility.</p>
          <Link to="/auth/mobile" className="mt-8 inline-flex rounded-2xl bg-brand-green px-8 py-4 font-black text-white shadow-btn">
            Start Selling Free →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="font-display text-4xl font-black text-brand-text">How Vendor Onboarding Works</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description]) => (
            <article key={number} className="rounded-4xl bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-xl font-black text-white">{number}</span>
              <h3 className="mt-5 text-xl font-black text-brand-text">{title}</h3>
              <p className="mt-3 leading-7 text-brand-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-black text-brand-text">Earnings Calculator</h2>
            <p className="mt-4 leading-8 text-brand-muted">Estimate your monthly payout after Malabarii&apos;s 8% commission.</p>
          </div>
          <div className="rounded-4xl border border-brand-border p-7 shadow-card">
            <label className="text-sm font-black text-brand-muted" htmlFor="sales-slider">Monthly sales</label>
            <input id="sales-slider" type="range" min="10000" max="500000" step="10000" value={sales} onChange={(e) => setSales(Number(e.target.value))} className="mt-5 w-full accent-brand-green" />
            <p className="mt-6 text-2xl font-black text-brand-text">If you sell ₹{sales.toLocaleString('en-IN')}/month,</p>
            <p className="mt-2 font-display text-5xl font-black text-brand-green">you earn ₹{earnings.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="font-display text-4xl font-black text-brand-text">Vendor Success Stories</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {['Heritage Dairy grew repeat orders by 38%', 'Kozhikode Greens moved 400 kg vegetables weekly', 'Daily Pantry added hotel bulk orders'].map((story) => (
            <article key={story} className="rounded-4xl bg-white p-7 shadow-card">
              <p className="text-brand-orange">★★★★★</p>
              <h3 className="mt-4 text-xl font-black text-brand-text">{story}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-greenDark px-4 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-4xl font-black">Requirements to Join</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['FSSAI license for food vendors', 'Bank account', 'Mobile number', 'Product photos'].map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-5 py-3 font-black">{item}</span>
            ))}
          </div>
          <Link to="/auth/mobile" className="mt-10 inline-flex rounded-2xl bg-brand-orange px-8 py-4 font-black text-white">
            Apply Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
