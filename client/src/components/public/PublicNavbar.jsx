import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  ['Home', '/'],
  ['Features', '/features'],
  ['For Hotels', '/for-hotels'],
  ['Sell With Us', '/sell-with-us'],
  ['Contact', '/contact'],
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-card backdrop-blur' : 'bg-white/80 backdrop-blur'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link
            to="/"
            className="bg-gradient-to-r from-brand-greenDark to-brand-greenLight bg-clip-text font-display text-3xl font-black text-transparent"
          >
            Malabarii
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-sm font-bold transition hover:text-brand-green ${
                    isActive ? 'text-brand-green' : 'text-brand-muted'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/auth/mobile" className="rounded-2xl border border-brand-green px-5 py-2 text-sm font-black text-brand-green">
              Login
            </Link>
            <Link to="/auth/mobile" className="rounded-2xl bg-brand-green px-5 py-2 text-sm font-black text-white shadow-btn">
              Get Started
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-bg text-2xl text-brand-greenDark lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>
        </nav>
      </header>

      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close menu backdrop"
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[86vw] flex-col bg-white p-6 shadow-modal transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-3xl font-black text-brand-green">Malabarii</span>
            <button type="button" onClick={() => setOpen(false)} className="text-2xl text-brand-muted" aria-label="Close menu">
              ×
            </button>
          </div>
          <div className="mt-10 grid gap-4">
            {links.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-brand-bg px-4 py-4 text-lg font-black text-brand-text"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-auto grid gap-3">
            <Link to="/auth/mobile" onClick={() => setOpen(false)} className="rounded-2xl border border-brand-green py-3 text-center font-black text-brand-green">
              Login
            </Link>
            <Link to="/auth/mobile" onClick={() => setOpen(false)} className="rounded-2xl bg-brand-green py-3 text-center font-black text-white">
              Get Started
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
