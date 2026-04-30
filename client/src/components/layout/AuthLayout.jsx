import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="app-shell min-h-screen bg-gradient-to-br from-brand-greenDark via-brand-green to-brand-greenLight px-4 py-8">
      <div className="pt-8 text-center text-white">
        <h1 className="font-display text-5xl font-black">Malabarii</h1>
        <p className="mt-2 text-sm font-semibold text-white/80">Good Food Rich Life</p>
      </div>
      <section className="animate-fade-in mt-10 rounded-4xl bg-white p-6 shadow-modal">
        <Outlet />
      </section>
    </div>
  );
}
