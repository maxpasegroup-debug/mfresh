import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../ui/BottomNav.jsx';
import Modal from '../ui/Modal.jsx';
import Toast from '../ui/Toast.jsx';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const count = useCartStore((state) => state.getCount());
  const { toast, modal, hideModal } = useUiStore();
  const items = [
    { id: 'home', icon: 'Home', label: 'Home', path: '/home' },
    { id: 'shop', icon: 'Fish', label: 'Seafood', path: '/shop' },
    { id: 'orders', icon: 'Bag', label: 'Orders', path: '/orders' },
    { id: 'cart', icon: 'Cart', label: 'Cart', path: '/cart', badge: count || null },
    { id: 'profile', icon: 'You', label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="app-shell">
      <div className="page-with-nav">
        <Outlet />
      </div>
      <BottomNav items={items} active={location.pathname} onSelect={(item) => navigate(item.path)} />
      <Toast message={toast?.message} type={toast?.type} />
      <Modal isOpen={Boolean(modal)} onClose={hideModal} title={modal || ''}>
        <div className="text-sm text-brand-muted">More details are loading.</div>
      </Modal>
    </div>
  );
}
