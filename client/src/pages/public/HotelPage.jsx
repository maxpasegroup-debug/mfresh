import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../api/http.js';

const painPoints = [
  ['Inconsistent supplier quality', 'Verified vendors and daily quality checks for repeatable kitchen operations.'],
  ['No GST invoices', 'Every eligible B2B order can include GST-ready billing details.'],
  ['Minimum order hassles', 'Flexible ordering across vendors with bulk pricing tiers.'],
  ['Cash-only payments', 'Razorpay-powered UPI, card, wallet, and account workflows.'],
];

const tiers = [
  ['Starter', 'Free', 'Up to ₹20K/month', 'Best for small cafes and canteens.'],
  ['Growth', '₹999/mo', 'Up to ₹1L/month', 'Bulk pricing, priority delivery, and credit review.'],
  ['Enterprise', 'Custom', 'Unlimited', 'Dedicated account management for large kitchens.'],
];

export default function HotelPage() {
  const [form, setForm] = useState({ hotelName: '', ownerName: '', mobile: '', city: '', type: 'restaurant' });
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    setStatus('Sending...');
    await publicApi.post('/api/vendors/hotel-enquiry', form);
    setStatus('Application received. Our team will call you shortly.');
    setForm({ hotelName: '', ownerName: '', mobile: '', city: '', type: 'restaurant' });
  }

  return (
    <main>
      <section className="bg-brand-greenDark px-4 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">🏨 B2B Solution</span>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight md:text-6xl">Built for Hotels & Restaurants</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              Reliable fresh supply, GST invoices, bulk pricing, and priority morning delivery for professional kitchens.
            </p>
            <Link to="/auth/mobile?mode=hotel" className="mt-8 inline-flex rounded-2xl bg-brand-orange px-8 py-4 font-black text-white">
              Apply Now →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Bulk rates', 'GST invoices', 'Credit limits', 'Morning priority'].map((item) => (
              <div key={item} className="rounded-4xl bg-white/10 p-6 text-xl font-black">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="font-display text-4xl font-black text-brand-text">Tired of supplier chaos?</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {painPoints.map(([pain, solution]) => (
            <article key={pain} className="rounded-4xl border border-brand-border bg-white p-7 shadow-card">
              <h3 className="text-xl font-black text-brand-text">Tired of {pain.toLowerCase()}?</h3>
              <p className="mt-3 leading-7 text-brand-muted">{solution}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-4xl font-black text-brand-text">Pricing That Scales With Your Kitchen</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {tiers.map(([name, price, limit, description]) => (
              <article key={name} className="rounded-4xl border border-brand-border p-7 shadow-card">
                <h3 className="text-2xl font-black text-brand-text">{name}</h3>
                <p className="mt-4 font-display text-4xl font-black text-brand-green">{price}</p>
                <p className="mt-2 font-black text-brand-text">{limit}</p>
                <p className="mt-4 leading-7 text-brand-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h2 className="font-display text-4xl font-black text-brand-text">Apply for a Hotel Account</h2>
          <p className="mt-4 leading-8 text-brand-muted">Share your details and the Malabarii B2B team will help set up pricing and delivery slots.</p>
        </div>
        <form onSubmit={submit} className="grid gap-4 rounded-4xl bg-white p-6 shadow-card">
          <input required value={form.hotelName} onChange={(e) => setForm({ ...form, hotelName: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Hotel name" />
          <input required value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Owner name" />
          <input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Mobile" />
          <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="City" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3">
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="canteen">Canteen</option>
          </select>
          <button className="rounded-2xl bg-brand-green px-6 py-4 font-black text-white" type="submit">Submit Application</button>
          {status && <p className="font-bold text-brand-green">{status}</p>}
        </form>
      </section>

      <section id="faq" className="bg-green-50 px-4 py-20">
        <div className="mx-auto max-w-4xl space-y-4">
          <h2 className="font-display text-4xl font-black text-brand-text">FAQ</h2>
          {['Can I get GST invoices?', 'Is there a credit limit?', 'Can I set recurring orders?'].map((question) => (
            <details key={question} className="rounded-3xl bg-white p-5 shadow-card">
              <summary className="cursor-pointer font-black text-brand-text">{question}</summary>
              <p className="mt-3 leading-7 text-brand-muted">Yes. Our B2B team configures this during onboarding based on your kitchen needs.</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
