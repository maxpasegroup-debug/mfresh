import { Link, useNavigate } from 'react-router-dom';
import CategoryCard from '../../components/public/CategoryCard.jsx';
import FeatureCard from '../../components/public/FeatureCard.jsx';
import PhoneMockup from '../../components/public/PhoneMockup.jsx';
import StepCard from '../../components/public/StepCard.jsx';
import TestimonialCard from '../../components/public/TestimonialCard.jsx';
import { categories, features, hotelBenefits, steps, testimonials } from './publicData.js';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-bg to-green-50">
        <div className="absolute right-[-8rem] top-28 h-[28rem] w-[28rem] rounded-full bg-brand-fresh/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="animate-fade-in">
            <span className="inline-flex rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-black text-brand-green shadow-card">
              🌿 Kerala&apos;s #1 Fresh Delivery App
            </span>
            <h1 className="mt-8 font-display text-[3rem] font-black leading-[0.95] text-brand-text md:text-7xl">
              Good Food,
              <br />
              Rich Life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Order fresh dairy, vegetables and daily essentials from trusted local vendors. Delivered to your door in minutes.
            </p>
            <div className="mt-8 grid gap-3 sm:flex">
              <Link to="/auth/mobile" className="rounded-2xl bg-brand-green px-8 py-4 text-center text-lg font-black text-white shadow-btn">
                Order Now →
              </Link>
              <button type="button" className="rounded-2xl border border-brand-green px-8 py-4 text-lg font-black text-brand-green">
                🍎 📱 Download App
              </button>
            </div>
            <p className="mt-6 text-sm font-black text-brand-muted">
              ⭐ 4.8 rating • 10,000+ happy customers • 500+ products
            </p>
          </div>
          <div className="relative min-h-[640px]">
            <div className="absolute left-2 top-10 z-10 rounded-3xl bg-white px-4 py-3 font-black text-brand-text shadow-modal">
              ⭐ 4.9 Heritage Dairy
            </div>
            <div className="absolute right-0 top-24 z-10 rounded-3xl bg-white px-4 py-3 font-black text-brand-text shadow-modal">
              🥛 Milk delivered by 7AM
            </div>
            <div className="absolute bottom-16 left-0 z-10 rounded-3xl bg-white px-4 py-3 font-black text-brand-green shadow-modal">
              ✅ Order placed!
            </div>
            <PhoneMockup />
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-gradient-to-r from-brand-orange to-brand-yellow py-4 text-lg font-black text-white">
        <div className="whitespace-nowrap animate-[marquee_24s_linear_infinite]">
          🎉 Free delivery above ₹199 • 🥛 Fresh dairy by 7AM • 🌿 Farm to door daily • 🏨 Special B2B rates for hotels • 🎉 Free delivery above ₹199
        </div>
      </div>

      <HowItWorks />
      <CategoriesSection />
      <FeaturesSection />
      <HotelsSection />
      <VendorCta />
      <TestimonialsSection />
      <AppDownload onWeb={() => navigate('/auth/mobile')} />
    </main>
  );
}

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-4xl font-black text-brand-text md:text-5xl">From Farm to Your Door</h2>
        <p className="mt-3 text-lg text-brand-muted">Three simple steps</p>
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
          Everything Fresh, Everything Daily
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map(([emoji, name, count]) => (
            <CategoryCard key={name} emoji={emoji} name={name} count={count} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/shop" className="rounded-2xl bg-brand-green px-8 py-4 font-black text-white shadow-btn">
            Browse All Products →
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
        Why Families & Hotels Choose Us
      </h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([icon, title, description]) => (
          <FeatureCard key={title} icon={icon} title={title} description={description} />
        ))}
      </div>
    </section>
  );
}

function HotelsSection() {
  return (
    <section id="hotels" className="bg-brand-greenDark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">🏨 B2B Solution</span>
          <h2 className="mt-6 font-display text-4xl font-black md:text-5xl">Running a Hotel or Restaurant?</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
            Get bulk pricing, GST invoices, credit limits and dedicated account management.
          </p>
          <div className="mt-8 grid gap-3 text-lg font-bold text-white/90">
            {hotelBenefits.map((item) => (
              <p key={item}>✅ {item}</p>
            ))}
          </div>
          <Link to="/for-hotels" className="mt-8 inline-flex rounded-2xl bg-brand-orange px-7 py-4 font-black text-white">
            Apply for Hotel Account →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Hotels served', { count: 500, suffix: '+' }],
            ['Monthly GMV', { count: 50, prefix: '₹', suffix: 'L+' }],
            ['On-time delivery', { count: 99.2, suffix: '%', decimals: 1 }],
            ['Average rating', { count: 4.9, suffix: '★', decimals: 1 }],
          ].map(([label, stat]) => (
            <div key={label} className="rounded-4xl bg-white/10 p-6 text-center">
              <p
                className="font-display text-4xl font-black"
                data-count-to={stat.count}
                data-prefix={stat.prefix || ''}
                data-suffix={stat.suffix || ''}
                data-decimals={stat.decimals || 0}
              >
                {stat.prefix || ''}
                {stat.count}
                {stat.suffix || ''}
              </p>
              <p className="mt-2 text-sm font-bold text-white/70">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VendorCta() {
  return (
    <section className="bg-green-50 px-4 py-20 text-center">
      <h2 className="font-display text-4xl font-black text-brand-text">Sell Your Products on Malabarii</h2>
      <p className="mt-3 text-lg text-brand-muted">Join 24+ vendors already growing their business</p>
      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
        {['📈 Grow your sales', '🛡️ Secure weekly payouts', '📊 Real-time analytics'].map((item) => (
          <span key={item} className="rounded-full bg-white px-5 py-3 font-black text-brand-green shadow-card">
            {item}
          </span>
        ))}
      </div>
      <Link to="/sell-with-us" className="mt-8 inline-flex rounded-2xl bg-brand-green px-8 py-4 font-black text-white shadow-btn">
        Start Selling →
      </Link>
      <p className="mt-3 text-sm font-bold text-brand-muted">Free to join • No setup fee</p>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <h2 className="text-center font-display text-4xl font-black text-brand-text">Loved by Families Across Kerala</h2>
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
      <h2 className="font-display text-4xl font-black text-brand-text">Get the Malabarii App</h2>
      <p className="mt-3 text-brand-muted">Available soon on Android & iOS</p>
      <div className="mt-10">
        <PhoneMockup compact />
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {['🍎 App Store', '📱 Play Store'].map((item) => (
          <button key={item} type="button" className="relative rounded-2xl bg-brand-text px-7 py-4 font-black text-white">
            {item}
            <span className="absolute -right-2 -top-2 rounded-full bg-brand-yellow px-2 py-1 text-xs text-brand-text">Soon</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={onWeb} className="mt-5 rounded-2xl border border-brand-green px-7 py-4 font-black text-brand-green">
        Use on Web →
      </button>
    </section>
  );
}
