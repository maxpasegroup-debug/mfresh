import { Link, useNavigate } from 'react-router-dom';
import CategoryCard from '../../components/public/CategoryCard.jsx';
import FeatureCard from '../../components/public/FeatureCard.jsx';
import PhoneMockup from '../../components/public/PhoneMockup.jsx';
import StepCard from '../../components/public/StepCard.jsx';
import TestimonialCard from '../../components/public/TestimonialCard.jsx';
import { categories, features, steps, testimonials } from './publicData.js';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="animate-fade-in">
            <span className="inline-flex rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-black text-brand-green shadow-card">
              Fresh seafood, cleaned and delivered
            </span>
            <h1 className="mt-8 font-display text-[3rem] font-black leading-[0.95] text-brand-text md:text-7xl">
              MFresh
              <br />
              Seafood Daily.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Order fresh fish, prawns, crab, squid, and seafood combos by weight. Pick cleaning style and delivery slot before checkout.
            </p>
            <div className="mt-8 grid gap-3 sm:flex">
              <Link to="/auth/mobile" className="rounded-2xl bg-brand-green px-8 py-4 text-center text-lg font-black text-white shadow-btn">
                Order Fresh Fish
              </Link>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="rounded-2xl border border-brand-green px-8 py-4 text-lg font-black text-brand-green"
              >
                View Seafood
              </button>
            </div>
            <p className="mt-6 text-sm font-black text-brand-muted">
              Same-day slots | Hygienic cleaning | Chilled delivery | Secure payment
            </p>
          </div>
          <div className="relative min-h-[620px]">
            <div className="absolute left-2 top-10 z-10 rounded-3xl bg-white px-4 py-3 font-black text-brand-text shadow-modal">
              Curry cut selected
            </div>
            <div className="absolute right-0 top-24 z-10 rounded-3xl bg-white px-4 py-3 font-black text-brand-text shadow-modal">
              1kg seer fish
            </div>
            <div className="absolute bottom-16 left-0 z-10 rounded-3xl bg-white px-4 py-3 font-black text-brand-green shadow-modal">
              Slot: 6PM - 8PM
            </div>
            <PhoneMockup />
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-gradient-to-r from-brand-green to-cyan-600 py-4 text-lg font-black text-white">
        <div className="whitespace-nowrap animate-[marquee_24s_linear_infinite]">
          Fresh fish by weight | Cleaning options | Same-day delivery slots | Free delivery above Rs 199 | MFresh seafood daily
        </div>
      </div>

      <HowItWorks />
      <CategoriesSection />
      <FeaturesSection />
      <QualitySection />
      <TestimonialsSection />
      <AppDownload onWeb={() => navigate('/auth/mobile')} />
    </main>
  );
}

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-4xl font-black text-brand-text md:text-5xl">Seafood Without the Market Trip</h2>
        <p className="mt-3 text-lg text-brand-muted">Three simple choices before checkout</p>
      </div>
      <div className="relative mt-12 grid gap-6 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-20 hidden border-t-2 border-dotted border-brand-border md:block" />
        {steps.map(([number, icon, title, description]) => (
          <StepCard key={number} number={number} icon={icon} title={title} description={description} />
        ))}
      </div>
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section id="categories" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-4xl font-black text-brand-text md:text-5xl">
          Fresh Catch Categories
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map(([emoji, name, count]) => (
            <CategoryCard key={name} emoji={emoji} name={name} count={count} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/shop" className="rounded-2xl bg-brand-green px-8 py-4 font-black text-white shadow-btn">
            Browse Seafood
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <h2 className="text-center font-display text-4xl font-black text-brand-text md:text-5xl">
        Built for Fresh Seafood Orders
      </h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([icon, title, description]) => (
          <FeatureCard key={title} icon={icon} title={title} description={description} />
        ))}
      </div>
    </section>
  );
}

function QualitySection() {
  const points = ['Freshness checked before packing', 'Cleaned as selected', 'Packed chilled', 'Delivered in your slot'];
  return (
    <section className="bg-brand-greenDark px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">MFresh Promise</span>
        <h2 className="mt-6 max-w-3xl font-display text-4xl font-black md:text-5xl">
          Fish-first operations, from sourcing to doorstep.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {points.map((point) => (
            <div key={point} className="rounded-3xl bg-white/10 p-5 text-lg font-black">
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <h2 className="text-center font-display text-4xl font-black text-brand-text">Loved by Seafood Families</h2>
      <div className="mt-10 flex gap-5 overflow-x-auto md:grid md:grid-cols-3">
        {testimonials.map(([quote, author]) => (
          <TestimonialCard key={author} quote={quote} author={author} />
        ))}
      </div>
    </section>
  );
}

function AppDownload({ onWeb }) {
  return (
    <section className="bg-white px-4 py-20 text-center">
      <h2 className="font-display text-4xl font-black text-brand-text">Start with MFresh Web</h2>
      <p className="mt-3 text-brand-muted">Mobile apps can come later. The seafood ordering flow is ready for web customers.</p>
      <div className="mt-10">
        <PhoneMockup compact />
      </div>
      <button type="button" onClick={onWeb} className="mt-8 rounded-2xl bg-brand-green px-8 py-4 font-black text-white shadow-btn">
        Order on Web
      </button>
    </section>
  );
}
