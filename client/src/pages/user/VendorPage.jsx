import { useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ProductCard from '../../components/ui/ProductCard.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import { useVendor } from '../../hooks/useVendors.js';
import { useUiStore } from '../../store/uiStore.js';
import { useEffect } from 'react';

export default function VendorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const { vendor, products, loading, error } = useVendor(id);

  useEffect(() => {
    if (error) showToast('Check your connection', 'error');
  }, [error, showToast]);

  if (loading) {
    return (
      <section className="section">
        <SkeletonCard variant="banner" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (!vendor) {
    return <EmptyState emoji="🏪" title="Vendor not found" subtitle="This store is not available." />;
  }

  return (
    <>
      <header className="bg-gradient-to-br from-brand-greenDark to-brand-green px-4 pb-6 pt-5 text-white">
        <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-black text-white/80">
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-4xl bg-white/15 text-4xl">
            {vendor.logo_url ? <img src={vendor.logo_url} alt={vendor.shop_name} className="h-full w-full object-cover" /> : '🏪'}
          </div>
          <div>
            <h1 className="font-display text-3xl font-black">{vendor.shop_name}</h1>
            <p className="text-sm font-bold text-white/80">{vendor.category || 'Fresh daily products'}</p>
            <div className="mt-2 flex gap-2 text-xs font-black">
              <span className="rounded-full bg-white/15 px-3 py-1">★ {Number(vendor.rating || 0).toFixed(1)}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">{vendor.total_orders || 0} orders</span>
            </div>
          </div>
        </div>
      </header>
      <section className="section">
        <h2 className="mb-3 font-display text-2xl font-black">Store Products</h2>
        {products.length ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => <ProductCard key={product.id} product={{ ...product, vendor_name: vendor.shop_name }} />)}
          </div>
        ) : (
          <EmptyState emoji="🥬" title="No products" subtitle="This vendor has no active products." />
        )}
      </section>
    </>
  );
}
