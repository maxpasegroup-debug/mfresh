import CategoryCard from '../../components/public/CategoryCard.jsx';
import FeatureCard from '../../components/public/FeatureCard.jsx';
import StepCard from '../../components/public/StepCard.jsx';
import { categories, features, steps } from './publicData.js';

const comparison = [
  ['Freshness', 'Morning-sourced seafood, chilled handling', 'Depends on market/store stock cycles'],
  ['Preparation', 'Cleaning and cut preference before checkout', 'Manual negotiation at counter'],
  ['Timing', 'Delivery slots for cooking plans', 'Travel, wait, carry, clean'],
  ['Pickles', 'Exclusive MFresh seafood pickle line', 'Separate store purchase'],
];

export default function FeaturesPage() {
  return (
    <main>
      <section className="sea-section px-4 py-20 text-center">
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-brand-green shadow-card">Built for seafood freshness</span>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-black leading-tight text-brand-text md:text-6xl">
          Everything MFresh Does Better
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
          A cleaner, colder, more convenient way to order fresh seafood, custom cuts, delivery slots, and MFresh Pickles.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-black text-brand-text">From Sea to Your Door</h2>
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
          <h2 className="text-center font-display text-4xl font-black text-brand-text">Fresh Catch and Pickles</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map(([emoji, name, count]) => (
              <CategoryCard key={name} emoji={emoji} name={name} count={count} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="text-center font-display text-4xl font-black text-brand-text">Why Seafood Buyers Choose Us</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, description]) => (
            <FeatureCard key={title} icon={icon} title={title} description={description} />
          ))}
        </div>
      </section>

      <section className="bg-brand-greenDark px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-black">MFresh vs Traditional Fish Buying</h2>
          <div className="mt-8 overflow-hidden rounded-4xl border border-white/10 bg-white">
            <div className="grid grid-cols-3 bg-brand-green text-sm font-black text-white md:text-base">
              <div className="p-4">Need</div>
              <div className="p-4">MFresh</div>
              <div className="p-4">Traditional</div>
            </div>
            {comparison.map(([need, mfresh, traditional]) => (
              <div key={need} className="grid grid-cols-3 border-t border-brand-border text-sm text-brand-text md:text-base">
                <div className="p-4 font-black">{need}</div>
                <div className="p-4">{mfresh}</div>
                <div className="p-4 text-brand-muted">{traditional}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
