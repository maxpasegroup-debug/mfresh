const sections = [
  ['Information We Collect', 'We collect account details, mobile number, delivery addresses, order history, payment status, support messages, and device or usage information needed to run the Malabarii service.'],
  ['How We Use Information', 'We use this information to process orders, coordinate vendors and delivery, send OTPs and service messages, improve product availability, prevent fraud, and support customer requests.'],
  ['Payments', 'Payments are processed through secure payment partners such as Razorpay. Malabarii does not store full card numbers or sensitive payment credentials.'],
  ['Sharing', 'We share only the information required with vendors, delivery partners, payment providers, SMS providers, and service vendors who help us operate the platform.'],
  ['Data Retention', 'We retain information for legal, tax, accounting, support, and operational requirements, including GST and order records where applicable in India.'],
  ['Your Choices', 'You can update profile information, request support, opt out of non-essential communications, and ask us to review deletion requests subject to legal retention obligations.'],
  ['Security', 'We use reasonable technical and organizational safeguards, but no online service is completely risk-free. Please keep your OTPs and PIN private.'],
  ['Contact', 'For privacy questions, contact hello@malabarii.com or write to Malabarii, Kozhikode, Kerala, India.'],
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" intro="How Malabarii handles customer, vendor, and hotel account information." sections={sections} />;
}

export function LegalPage({ title, intro, sections }) {
  return (
    <main className="bg-white">
      <section className="bg-gradient-to-br from-brand-greenDark to-brand-green px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-5xl font-black md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{intro}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden self-start rounded-4xl bg-brand-bg p-6 lg:sticky lg:top-28 lg:block">
          <p className="font-black text-brand-text">Contents</p>
          <div className="mt-4 grid gap-3">
            {sections.map(([heading]) => (
              <a key={heading} href={`#${heading.toLowerCase().replaceAll(' ', '-')}`} className="text-sm font-bold text-brand-muted hover:text-brand-green">
                {heading}
              </a>
            ))}
          </div>
        </aside>
        <div className="space-y-8">
          {sections.map(([heading, body]) => (
            <section key={heading} id={heading.toLowerCase().replaceAll(' ', '-')} className="rounded-4xl border border-brand-border p-6">
              <h2 className="font-display text-3xl font-black text-brand-text">{heading}</h2>
              <p className="mt-4 leading-8 text-brand-muted">{body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
