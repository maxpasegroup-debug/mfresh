export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-[430px] bg-black/40 backdrop-blur-sm">
      <button className="absolute inset-0 h-full w-full" type="button" onClick={onClose} />
      <section className="animate-slide-up absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-4xl bg-white p-5 shadow-modal">
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-brand-border"
          aria-label="Close"
        />
        {title ? <h2 className="mb-4 text-xl font-black text-brand-text">{title}</h2> : null}
        {children}
      </section>
    </div>
  );
}
