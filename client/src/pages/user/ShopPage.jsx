import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CategoryPill from '../../components/ui/CategoryPill.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ProductCard from '../../components/ui/ProductCard.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { useCategories, useProducts } from '../../hooks/useProducts.js';
import { useCartStore } from '../../store/cartStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function ShopPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const showToast = useUiStore((state) => state.showToast);
  const cartCount = useCartStore((state) => state.getCount());
  const { categories } = useCategories();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [allProducts, setAllProducts] = useState([]);
  const loaderRef = useRef(null);
  const params = useMemo(
    () => ({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      sort: searchParams.get('sort') || 'newest',
      limit: 20,
      page,
    }),
    [searchParams, page],
  );
  const { products, total, loading, error } = useProducts(params);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchInput.trim()) next.set('search', searchInput.trim());
      else next.delete('search');
      next.delete('page');
      setPage(1);
      setSearchParams(next);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  useEffect(() => {
    if (page === 1) setAllProducts(products);
    else setAllProducts((current) => [...current, ...products.filter((product) => !current.some((item) => item.id === product.id))]);
  }, [products, page]);

  useEffect(() => {
    if (error) showToast('Check your connection', 'error');
  }, [error, showToast]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && allProducts.length < total) {
        setPage((value) => value + 1);
      }
    });
    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [allProducts.length, loading, total]);

  const updateParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete('page');
      setPage(1);
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  return (
    <>
      <TopHeader
        title="Seafood"
        subtitle={`${total} fresh items`}
        rightActions={[{ label: 'Cart', icon: cartCount ? `Cart ${cartCount}` : 'Cart', onClick: () => navigate('/cart') }]}
      />
      <section className="section space-y-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search fish, prawns, crab..."
          className="h-12 w-full rounded-3xl border border-brand-border bg-white px-4 text-sm font-bold outline-none focus:border-brand-green"
        />
        <div className="scroll-row">
          <CategoryPill
            category={{ name: 'All', emoji: 'All' }}
            active={!params.category}
            onClick={() => updateParam('category', '')}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              category={{ ...category, emoji: category.emoji || 'Fish' }}
              active={params.category === (category.slug || category.id)}
              onClick={() => updateParam('category', category.slug || category.id)}
            />
          ))}
        </div>
        <select
          value={params.sort}
          onChange={(event) => updateParam('sort', event.target.value)}
          className="h-11 rounded-2xl border border-brand-border bg-white px-3 text-sm font-bold text-brand-text outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </section>

      <section className="section">
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : allProducts.length ? (
          <div className="grid grid-cols-2 gap-3">
            {allProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState emoji="Fish" title="No seafood found" subtitle="Try a different search or category." />
        )}
        <div ref={loaderRef} className="h-10" />
        {loading && page > 1 ? <SkeletonCard /> : null}
      </section>
    </>
  );
}
