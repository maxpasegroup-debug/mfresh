const styles = {
  success: 'bg-brand-green text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-[398px]">
      <div className={`${styles[type] || styles.success} animate-fade-in rounded-2xl px-4 py-3 text-sm font-bold shadow-modal`}>
        {message}
      </div>
    </div>
  );
}
