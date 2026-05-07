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
      <section className="bg-gradient-to-br from-white to-green-50 px-4 py-20 text-center">
        <h1 className="font-display text-5xl font-black text-brand-text md:text-6xl">Contact Malabarii</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-muted">Questions, partnerships, orders, or vendor help. We are here Monday to Saturday.</p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <form onSubmit={submit} className="grid gap-4 rounded-4xl bg-white p-6 shadow-card">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Name" />
          <input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Mobile" />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Email" />
          <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-2xl border border-brand-border px-4 py-3">
            <option value="support">Support</option>
            <option value="orders">Orders</option>
            <option value="hotel">Hotel account</option>
            <option value="vendor">Vendor enquiry</option>
            <option value="partnership">Partnership</option>
          </select>
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-36 rounded-2xl border border-brand-border px-4 py-3" placeholder="Message" />
          <button className="rounded-2xl bg-brand-green px-6 py-4 font-black text-white" type="submit">Submit</button>
          {status && <p className="font-bold text-brand-green">{status}</p>}
        </form>
        <div className="space-y-4">
          {['📞 +91 XXXXX XXXXX', '📧 hello@malabarii.com', '📍 Kozhikode, Kerala, India', '⏰ Mon-Sat: 6AM - 10PM'].map((item) => (
            <div key={item} className="rounded-4xl bg-white p-6 text-xl font-black text-brand-text shadow-card">{item}</div>
          ))}
          <div className="flex min-h-60 items-center justify-center rounded-4xl bg-gradient-to-br from-brand-green to-brand-fresh p-8 text-center text-white shadow-card">
            <div>
              <p className="text-5xl">📍</p>
              <p className="mt-4 text-2xl font-black">Kozhikode, Kerala, India</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
