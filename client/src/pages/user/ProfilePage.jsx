import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuthStore } from '../../store/authStore.js';

const accountItems = ['My Addresses', 'Payment Methods', 'Notifications'];
const hotelItems = ['GST Invoices', 'Bulk Orders', 'Credit Limit'];
const appItems = ['About Malabarii', 'Help & Support', 'Rate the App'];

export default function ProfilePage() {
  const { user, logout, switchMode } = useAuthStore();
  const [modal, setModal] = useState(null);
  const initial = user?.name?.[0]?.toUpperCase() || 'M';
  const hotelMode = user?.mode === 'hotel';

  return (
    <>
      <header className="bg-gradient-to-br from-brand-greenDark to-brand-green px-4 pb-6 pt-8 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-4xl bg-white text-3xl font-black text-brand-green">
            {initial}
          </div>
          <div>
            <h1 className="font-display text-3xl font-black">{user?.name || 'Malabarii User'}</h1>
            <p className="text-sm font-bold text-white/80">+91 {user?.mobile}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 rounded-3xl bg-white/15 p-1">
          {['individual', 'hotel'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => switchMode(mode)}
              className={`rounded-2xl py-2 text-sm font-black capitalize ${
                user?.mode === mode ? 'bg-white text-brand-green' : 'text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </header>

      <section className="section space-y-4">
        {hotelMode ? (
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Orders', '0'],
              ['Spent', '₹0'],
              ['Credit', '₹0'],
            ].map(([label, value]) => (
              <div key={label} className="card p-3 text-center">
                <p className="text-lg font-black text-brand-text">{value}</p>
                <p className="text-xs font-bold text-brand-muted">{label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <MenuSection title="Account" items={accountItems} onSelect={setModal} />
        {hotelMode ? <MenuSection title="Hotel" items={hotelItems} onSelect={setModal} /> : null}
        <MenuSection title="App" items={appItems} onSelect={setModal} />

        <Button variant="danger" fullWidth onClick={logout}>
          Sign Out
        </Button>
        <p className="pb-6 text-center text-xs font-bold text-brand-muted">Malabarii v0.1.0</p>
      </section>

      <Modal isOpen={Boolean(modal)} onClose={() => setModal(null)} title={modal || ''}>
        <p className="text-sm font-semibold text-brand-muted">
          {modal === 'Notifications'
            ? 'Notification preferences are enabled for order updates and offers.'
            : `${modal} information will appear here.`}
        </p>
      </Modal>
    </>
  );
}

function MenuSection({ title, items, onSelect }) {
  return (
    <div className="card overflow-hidden">
      <h2 className="px-4 pt-4 text-xs font-black uppercase tracking-wide text-brand-muted">{title}</h2>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="flex w-full items-center justify-between border-b border-brand-border px-4 py-4 text-left last:border-0"
        >
          <span className="font-bold text-brand-text">{item}</span>
          <span className="text-brand-muted">›</span>
        </button>
      ))}
    </div>
  );
}
