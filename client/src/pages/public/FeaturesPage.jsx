import CategoryCard from '../../components/public/CategoryCard.jsx';
import FeatureCard from '../../components/public/FeatureCard.jsx';
import StepCard from '../../components/public/StepCard.jsx';
import { categories, features, steps } from './publicData.js';

const comparison = [
  ['Freshness', 'Sourced daily from local vendors', 'Depends on store stock cycles'],
  ['Time', 'Order in minutes from home', 'Travel, queue, and billing time'],
  ['Payments', 'UPI, cards, wallets, Razorpay', 'Often cash or limited options'],
  ['Hotels', 'Bulk rates, GST invoices, credit limits', 'Manual supplier follow-ups'],
];

export default function FeaturesPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-white to-green-50 px-4 py-20 text-center">
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-brand-green shadow-card">Built for daily freshness</span>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-black leading-tight text-brand-text md:text-6xl">
          Everything Malabarii Does Better
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
          A faster, cleaner way for homes and hotels to buy fresh dairy, vegetables, pantry goods, and everyday essentials.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-black text-brand-text">From Farm to Your Door</h2>
          <p className="mt-3 text-lg text-brand-muted">Three simple steps</p>
        </div>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-20 hidden border-t-2 border-dotted border-brand-border md:block" />
          {steps.map(([number, icon, title, description]) => (
            <StepCard key={number} number={number} icon={icon} title={title} description={description} />
          ))}
        </div>
      </section>

      <section id="categories" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-4xl font-black text-brand-text">Everything Fresh, Everything Daily</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map(([emoji, name, count]) => (
              <CategoryCard key={name} emoji={emoji} name={name} count={count} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="text-center font-display text-4xl font-black text-brand-text">Why Families & Hotels Choose Us</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, description]) => (
            <FeatureCard key={title} icon={icon} title={title} description={description} />
          ))}
        </div>
      </section>

      <section className="bg-brand-greenDark px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-black">Malabarii vs Traditional Grocery Shopping</h2>
          <div className="mt-8 overflow-hidden rounded-4xl border border-white/10 bg-white">
            <div className="grid grid-cols-3 bg-brand-green text-sm font-black text-white md:text-base">
              <div className="p-4">Need</div>
              <div className="p-4">Malabarii</div>
              <div className="p-4">Traditional</div>
            </div>
            {comparison.map(([need, malabarii, traditional]) => (
              <div key={need} className="grid grid-cols-3 border-t border-brand-border text-sm text-brand-text md:text-base">
                <div className="p-4 font-black">{need}</div>
                <div className="p-4">{malabarii}</div>
                <div className="p-4 text-brand-muted">{traditional}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
