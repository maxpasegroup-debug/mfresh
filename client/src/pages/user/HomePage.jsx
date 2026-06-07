import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../../components/shared/HeroBanner.jsx';
import CategoryPill from '../../components/ui/CategoryPill.jsx';
import ProductCard from '../../components/ui/ProductCard.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import { useCategories, useFeaturedProducts, useProducts } from '../../hooks/useProducts.js';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

const fallbackBanners = [
  { id: 'seer', tag: 'Fresh Catch', title: 'Seer fish, cleaned your way', emoji: 'Wave', gradient: 'from-brand-greenDark to-brand-green', path: '/shop?search=seer' },
  { id: 'prawn', tag: 'Ready to Cook', title: 'Prawns with shell or cleaned', emoji: 'Sea', gradient: 'from-brand-green to-brand-fresh', path: '/shop?search=prawn' },
  { id: 'pickle', tag: 'MFresh Pickles', title: 'Coastal flavour in every jar', emoji: 'Jar', gradient: 'from-brand-orange to-amber-500', path: '/shop?search=pickle' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getCount());
  const showToast = useUiStore((state) => state.showToast);
  const { categories, loading: categoriesLoading } = useCategories();
  const { products: featured, loading: featuredLoading } = useFeaturedProducts();
  const productParams = useMemo(() => ({ limit: 20 }), []);
  const { products, loading: productsLoading, error } = useProducts(productParams);
  const [search, setSearch] = useState('');

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
            <h1 className="font-display text-3xl font-black text-brand-green">MFresh</h1>
            <p className="text-xs font-bold text-brand-muted">Seafood and pickles from Malabar</p>
          </button>
          <button type="button" onClick={() => navigate('/cart')} className="relative h-11 w-11 rounded-2xl bg-white text-xl shadow-card">
            Cart
            {cartCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-brand-orange px-1.5 text-xs font-black text-white">{cartCount}</span> : null}
          </button>
        </div>
        <form onSubmit={submitSearch} className="mt-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search fish, prawns, crab..."
            className="h-12 w-full rounded-3xl border border-brand-border bg-white px-4 text-sm font-bold outline-none focus:border-brand-green"
          />
        </form>
      </header>

      <div className="overflow-hidden bg-brand-green py-2 text-sm font-black text-white">
        <div className="whitespace-nowrap animate-[marquee_18s_linear_infinite]">
          Fresh catch daily | Cleaning options | Same-day slots | MFresh Pickles exclusive
        </div>
      </div>

      <section className="section">
        <div className="scroll-row">
          {fallbackBanners.map((banner) => (
            <HeroBanner
              key={banner.id}
              title={banner.title}
              tag={banner.tag}
              emoji={banner.emoji}
              gradient={banner.gradient}
              onClick={() => navigate(banner.path)}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-2xl font-black">Fresh Categories</h2>
          {categoriesLoading ? <span className="text-xs font-bold text-brand-muted">Loading</span> : null}
        </div>
        <div className="scroll-row">
          <CategoryPill category={{ name: 'All', emoji: 'All' }} active onClick={() => navigate('/shop')} />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              category={{ ...category, emoji: category.emoji || 'Fish' }}
              onClick={() => navigate(`/shop?category=${category.slug || category.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-black">Today&apos;s Fresh Catch</h2>
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
        <h2 className="font-display text-2xl font-black">All Seafood</h2>
        <div className="grid grid-cols-2 gap-3">
          {productsLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  );
}
