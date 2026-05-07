import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicFooter from '../public/PublicFooter.jsx';
import PublicNavbar from '../public/PublicNavbar.jsx';

export default function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const counters = document.querySelectorAll('[data-count-to]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target;
          const end = Number(element.dataset.countTo);
          const prefix = element.dataset.prefix || '';
          const suffix = element.dataset.suffix || '';
          const decimals = Number(element.dataset.decimals || 0);
          const start = performance.now();
          const duration = 1200;

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = `${prefix}${(end * eased).toFixed(decimals)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          }

          requestAnimationFrame(tick);
          observer.unobserve(element);
        });
      },
      { threshold: 0.4 },
    );

    counters.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </div>
  );
}
