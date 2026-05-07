export default function TestimonialCard({ quote, author }) {
  return (
    <article className="reveal min-w-[310px] rounded-4xl border border-brand-border bg-white p-7 shadow-card md:min-w-0">
      <p className="text-brand-orange">★★★★★</p>
      <p className="mt-5 text-lg font-semibold leading-8 text-brand-text">&quot;{quote}&quot;</p>
      <p className="mt-6 text-sm font-black text-brand-green">— {author}</p>
    </article>
  );
}
