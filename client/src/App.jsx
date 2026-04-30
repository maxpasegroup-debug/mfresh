import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout.jsx';
import UserLayout from './components/layout/UserLayout.jsx';
import VendorLayout from './components/layout/VendorLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import Spinner from './components/ui/Spinner.jsx';
import { useAuthStore } from './store/authStore.js';
import MobilePage from './pages/auth/MobilePage.jsx';
import OtpPage from './pages/auth/OtpPage.jsx';
import PinPage from './pages/auth/PinPage.jsx';
import SetPinPage from './pages/auth/SetPinPage.jsx';
import RolePage from './pages/auth/RolePage.jsx';
import HomePage from './pages/user/HomePage.jsx';
import ShopPage from './pages/user/ShopPage.jsx';
import OrdersPage from './pages/user/OrdersPage.jsx';
import OrderDetailPage from './pages/user/OrderDetailPage.jsx';
import CartPage from './pages/user/CartPage.jsx';
import CheckoutPage from './pages/user/CheckoutPage.jsx';
import ProfilePage from './pages/user/ProfilePage.jsx';
import VendorPage from './pages/user/VendorPage.jsx';
import VendorHomePage from './pages/vendor/VendorHomePage.jsx';
import VendorProductsPage from './pages/vendor/VendorProductsPage.jsx';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage.jsx';
import VendorEarningsPage from './pages/vendor/VendorEarningsPage.jsx';
import VendorProfilePage from './pages/vendor/VendorProfilePage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminVendorsPage from './pages/admin/AdminVendorsPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminOffersPage from './pages/admin/AdminOffersPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

function PrivateRoute({ children, roles }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/mobile" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function RootRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={user ? '/home' : '/auth/mobile'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/mobile" replace />} />
        <Route path="mobile" element={<MobilePage />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="pin" element={<PinPage />} />
        <Route path="set-pin" element={<SetPinPage />} />
        <Route path="role" element={<RolePage />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/vendor/:id" element={<VendorPage />} />
      </Route>

      <Route
        path="/vendor-dashboard"
        element={
          <PrivateRoute roles={['vendor', 'admin']}>
            <VendorLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<VendorHomePage />} />
        <Route path="products" element={<VendorProductsPage />} />
        <Route path="orders" element={<VendorOrdersPage />} />
        <Route path="earnings" element={<VendorEarningsPage />} />
        <Route path="profile" element={<VendorProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="vendors" element={<AdminVendorsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="app-shell flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
