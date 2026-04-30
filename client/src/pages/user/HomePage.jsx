import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/http.js';
import HeroBanner from '../../components/shared/HeroBanner.jsx';
import VendorCard from '../../components/shared/VendorCard.jsx';
import CategoryPill from '../../components/ui/CategoryPill.jsx';
import ProductCard from '../../components/ui/ProductCard.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import { useCategories, useFeaturedProducts, useProducts } from '../../hooks/useProducts.js';
import { useVendors } from '../../hooks/useVendors.js';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

const fallbackBanners = [
  { id: 'dairy', tag: 'Dairy Deal', title: 'Fresh milk before breakfast', emoji: '🥛', gradient: 'from-brand-green to-brand-fresh', path: '/shop?category=dairy' },
  { id: 'veg', tag: 'Veggie Offer', title: 'Farm greens for every meal', emoji: '🥬', gradient: 'from-brand-orange to-amber-500', path: '/shop?category=vegetables' },
  { id: 'hotel', tag: 'B2B Kitchens', title: 'Bulk supply for hotels', emoji: '🍽️', gradient: 'from-[#0f2027] to-[#2c5364]', path: '/shop' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cartCount = useCartStore((state) => state.getCount());
  const showToast = useUiStore((state) => state.showToast);
  const { categories, loading: categoriesLoading } = useCategories();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { products: featured, loading: featuredLoading } = useFeaturedProducts();
  const productParams = useMemo(() => ({ limit: 20 }), []);
  const { products, loading: productsLoading, error } = useProducts(productParams);
  const [banners, setBanners] = useState(fallbackBanners);
  const [search, setSearch] = useState('');

  useEffect(() => {
    publicApi
      .get('/api/banners')
      .then((response) => {
        if (response.data.banners?.length) setBanners(response.data.banners);
      })
      .catch(() => setBanners(fallbackBanners));
  }, []);

  useEffect(() => {
    if (error) showToast('Check your connection', 'error');
  }, [error, showToast]);

  const submitSearch = useCallback(
    (event) => {
      event.preventDefault();
      if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    },
    [navigate, search],
  );

  return (
    <>
      <header className="sticky top-0 z-30 bg-brand-bg px-4 pb-4 pt-5">
        <div className="flex items-center justify-between gap-3">
          <button type="button" className="text-left" onClick={() => navigate('/profile')}>
            <h1 className="font-display text-3xl font-black text-brand-green">Malabarii</h1>
            <p className="text-xs font-bold text-brand-muted">📍 {user?.location || 'Set Location'}</p>
          </button>
          <div className="flex gap-2">
            <button type="button" className="relative h-11 w-11 rounded-2xl bg-white text-xl shadow-card">
              🔔<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-orange" />
            </button>
            <button type="button" onClick={() => navigate('/cart')} className="relative h-11 w-11 rounded-2xl bg-white text-xl shadow-card">
              🧺
              {cartCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-brand-orange px-1.5 text-xs font-black text-white">{cartCount}</span> : null}
            </button>
          </div>
        </div>
        <form onSubmit={submitSearch} className="mt-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search milk, tomato, rice..."
            className="h-12 w-full rounded-3xl border border-brand-border bg-white px-4 text-sm font-bold outline-none focus:border-brand-green"
          />
        </form>
      </header>

      <div className="overflow-hidden bg-brand-green py-2 text-sm font-black text-white">
        <div className="whitespace-nowrap animate-[marquee_18s_linear_infinite]">
          🎉 Free delivery above ₹199 • 🥛 Fresh dairy by 7AM • 🌿 Organic farm direct •
        </div>
      </div>

      {user?.mode === 'hotel' ? (
        <section className="section">
          <div className="card bg-gradient-to-br from-[#0f2027] to-[#2c5364] p-5 text-white">
            <p className="text-sm font-bold text-white/70">Hotel mode</p>
            <h2 className="mt-1 font-display text-2xl font-black">Bulk kitchen supply, simplified.</h2>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="scroll-row">
          {banners.map((banner) => (
            <HeroBanner
              key={banner.id || banner.title}
              title={banner.title}
              tag={banner.tag || 'Fresh'}
              emoji={banner.emoji || '🥬'}
              gradient={banner.gradient || 'from-brand-green to-brand-greenLight'}
              onClick={() => navigate(banner.path || '/shop')}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-black">Categories</h2>
          {categoriesLoading ? <span className="text-xs font-bold text-brand-muted">Loading</span> : null}
        </div>
        <div className="scroll-row">
          <CategoryPill category={{ name: 'All', emoji: '🧺' }} active onClick={() => navigate('/shop')} />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              category={{ ...category, emoji: category.emoji || '🥬' }}
              onClick={() => navigate(`/shop?category=${category.slug || category.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="mb-3 font-display text-2xl font-black">Top Vendors</h2>
        <div className="scroll-row">
          {vendorsLoading
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} variant="vendor" />)
            : vendors.slice(0, 6).map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} onClick={() => navigate(`/vendor/${vendor.id}`)} />
              ))}
        </div>
      </section>

      <section className="section">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-black">Today&apos;s Picks 🌟</h2>
          <button type="button" onClick={() => navigate('/shop')} className="text-xs font-black text-brand-orange">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredLoading
            ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
            : featured.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="section space-y-3">
        <h2 className="font-display text-2xl font-black">All Products</h2>
        <div className="grid grid-cols-2 gap-3">
          {productsLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  );
}
