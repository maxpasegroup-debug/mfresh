import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="bg-brand-greenDark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-display text-4xl font-black">Malabarii</h2>
          <p className="mt-3 font-bold text-white/85">Good Food Rich Life</p>
          <p className="mt-3 text-sm leading-6 text-white/65">Delivering freshness across Kerala</p>
          <div className="mt-5 flex gap-3">
            {['IG', 'FB', 'WA'].map((item) => (
              <span key={item} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black">
                {item}
              </span>
            ))}
          </div>
        </div>
        <FooterColumn
          title="Quick Links"
          items={[
            ['Home', '/'],
            ['Features', '/features'],
            ['Categories', '/features#categories'],
            ['For Hotels', '/for-hotels'],
            ['Sell With Us', '/sell-with-us'],
          ]}
        />
        <FooterColumn
          title="Support"
          items={[
            ['Contact Us', '/contact'],
            ['FAQ', '/for-hotels#faq'],
            ['Track Order', '/auth/mobile'],
            ['Return Policy', '/terms'],
            ['Privacy Policy', '/privacy'],
            ['Terms of Service', '/terms'],
          ]}
        />
        <div>
          <h3 className="text-lg font-black">Contact</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
            <p>📍 Kozhikode, Kerala, India</p>
            <p>📞 +91 XXXXX XXXXX</p>
            <p>📧 hello@malabarii.com</p>
            <p>⏰ Mon-Sat: 6AM - 10PM</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/65 md:flex md:justify-center md:gap-6">
        <span>© 2025 Malabarii. All rights reserved.</span>
        <span>Made with ❤️ in Kerala</span>
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
