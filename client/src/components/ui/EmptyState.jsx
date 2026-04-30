import Button from './Button.jsx';

export default function EmptyState({ emoji, title, subtitle, action, onAction }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
      <div className="text-6xl">{emoji}</div>
      <h2 className="mt-4 font-display text-2xl font-black text-brand-text">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-brand-muted">{subtitle}</p> : null}
      {action ? (
        <Button onClick={onAction} className="mt-5">
          {action}
        </Button>
      ) : null}
    </div>
  );
}
