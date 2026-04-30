import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../ui/BottomNav.jsx';
import Toast from '../ui/Toast.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function VendorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useUiStore((state) => state.toast);
  const items = [
    { id: 'home', icon: '🏪', label: 'Home', path: '/vendor-dashboard' },
    { id: 'products', icon: '🥬', label: 'Products', path: '/vendor-dashboard/products' },
    { id: 'orders', icon: '📦', label: 'Orders', path: '/vendor-dashboard/orders' },
    { id: 'earnings', icon: '₹', label: 'Earnings', path: '/vendor-dashboard/earnings' },
    { id: 'profile', icon: '👤', label: 'Profile', path: '/vendor-dashboard/profile' },
  ];

  return (
    <div className="app-shell">
      <div className="page-with-nav bg-orange-50">
        <Outlet />
      </div>
      <BottomNav items={items} active={location.pathname} onSelect={(item) => navigate(item.path)} />
      <Toast message={toast?.message} type={toast?.type} />
    </div>
  );
}
