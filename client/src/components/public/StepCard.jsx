export default function StepCard({ number, icon, title, description }) {
  return (
    <article className="reveal relative rounded-4xl bg-white p-7 shadow-card">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-2xl font-black text-white">
          {number}
        </span>
        <span className="text-5xl">{icon}</span>
      </div>
      <h3 className="mt-6 text-2xl font-black text-brand-text">{title}</h3>
      <p className="mt-3 leading-7 text-brand-muted">{description}</p>
    </article>
  );
}
