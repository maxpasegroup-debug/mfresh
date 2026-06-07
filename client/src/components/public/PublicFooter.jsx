import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="bg-brand-greenDark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-display text-4xl font-black">MFresh</h2>
          <p className="mt-3 font-bold text-cyan-100">Love From Malabar</p>
          <p className="mt-3 text-sm leading-6 text-white/65">Fresh seafood, cleaned to order, chilled and delivered across Kerala.</p>
          <div className="mt-5 flex gap-3">
            {['IG', 'FB', 'WA'].map((item) => (
              <span key={item} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black">
                {item}
              </span>
            ))}
          </div>
        </div>
        <FooterColumn
          title="Explore"
          items={[
            ['Home', '/'],
            ['Seafood', '/shop'],
            ['MFresh Pickles', '/shop?search=pickle'],
            ['Features', '/features'],
          ]}
        />
        <FooterColumn
          title="Support"
          items={[
            ['Contact Us', '/contact'],
            ['Track Order', '/auth/mobile'],
            ['Privacy Policy', '/privacy'],
            ['Terms of Service', '/terms'],
          ]}
        />
        <div>
          <h3 className="text-lg font-black">Contact</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
            <p>Kochi, Kerala, India</p>
            <p>+91 XXXXX XXXXX</p>
            <p>hello@mfresh.in</p>
            <p>Daily: 6AM - 10PM</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/65 md:flex md:justify-center md:gap-6">
        <span>Copyright 2026 MFresh. All rights reserved.</span>
        <span>Built with love from the Malabar coast</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map(([label, path]) => (
          <Link key={label} to={path} className="text-sm font-semibold text-white/70 transition hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
