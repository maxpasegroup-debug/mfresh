export default function FeatureCard({ icon, title, description }) {
  return (
    <article className="reveal group rounded-4xl border border-brand-border bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-modal">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-bg text-4xl transition group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-black text-brand-text">{title}</h3>
      <p className="mt-3 leading-7 text-brand-muted">{description}</p>
    </article>
  );
}
