export default function Input({ label, error, hint, prefix, suffix, className = '', ...rest }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-bold text-brand-text">{label}</span> : null}
      <span
        className={`flex h-12 items-center rounded-2xl border bg-white px-3 transition ${
          error ? 'border-red-500' : 'border-brand-border focus-within:border-brand-green'
        } ${className}`}
      >
        {prefix ? <span className="mr-2 text-sm font-bold text-brand-muted">{prefix}</span> : null}
        <input
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-brand-text outline-none placeholder:text-brand-muted"
          {...rest}
        />
        {suffix ? <span className="ml-2 text-sm font-bold text-brand-muted">{suffix}</span> : null}
      </span>
      {error ? <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span> : null}
      {hint && !error ? <span className="mt-1 block text-xs text-brand-muted">{hint}</span> : null}
    </label>
  );
}
