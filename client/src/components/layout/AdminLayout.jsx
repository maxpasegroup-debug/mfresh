import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../ui/BottomNav.jsx';
import Toast from '../ui/Toast.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useUiStore((state) => state.toast);
  const items = [
    { id: 'dashboard', icon: '📊', label: 'Dash', path: '/admin' },
    { id: 'vendors', icon: '🏪', label: 'Vendors', path: '/admin/vendors' },
    { id: 'products', icon: '🥬', label: 'Products', path: '/admin/products' },
    { id: 'orders', icon: '📦', label: 'Orders', path: '/admin/orders' },
    { id: 'settings', icon: '⚙️', label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="app-shell bg-[#0f2027]">
      <div className="page-with-nav bg-slate-950 text-white">
        <Outlet />
      </div>
      <BottomNav items={items} active={location.pathname} onSelect={(item) => navigate(item.path)} />
      <Toast message={toast?.message} type={toast?.type} />
    </div>
  );
}
