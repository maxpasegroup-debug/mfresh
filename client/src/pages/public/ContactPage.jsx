import { useState } from 'react';
import { publicApi } from '../../api/http.js';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', subject: 'support', message: '' });
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    setStatus('Sending...');
    await publicApi.post('/api/contact', form);
    setStatus('Message sent. We will get back to you soon.');
    setForm({ name: '', mobile: '', email: '', subject: 'support', message: '' });
  }

  return (
    <main>
      <section className="sea-section px-4 py-20 text-center">
        <h1 className="font-display text-5xl font-black text-brand-text md:text-6xl">Contact MFresh</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
          Questions about fresh seafood, cleaning options, delivery slots, pickles, or order support.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <form onSubmit={submit} className="grid gap-4 rounded-4xl bg-white p-6 shadow-card">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Name" />
          <input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Mobile" />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Email" />
          <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3">
            <option value="support">Support</option>
            <option value="orders">Orders</option>
            <option value="seafood">Seafood freshness</option>
            <option value="pickles">MFresh Pickles</option>
            <option value="partnership">Partnership</option>
          </select>
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-36 rounded-2xl border border-brand-border px-4 py-3" placeholder="Message" />
          <button className="rounded-2xl bg-brand-green px-6 py-4 font-black text-white" type="submit">Submit</button>
          {status && <p className="font-bold text-brand-green">{status}</p>}
        </form>
        <div className="space-y-4">
          {['+91 XXXXX XXXXX', 'hello@mfresh.in', 'Kochi, Kerala, India', 'Daily: 6AM - 10PM'].map((item) => (
            <div key={item} className="rounded-4xl bg-white p-6 text-xl font-black text-brand-text shadow-card">{item}</div>
          ))}
          <div className="flex min-h-60 items-center justify-center rounded-4xl bg-gradient-to-br from-brand-greenDark to-brand-green p-8 text-center text-white shadow-card">
            <div>
              <p className="font-display text-5xl font-black">MFresh</p>
              <p className="mt-4 text-2xl font-black">Love From Malabar</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
