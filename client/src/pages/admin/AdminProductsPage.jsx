import { useMemo, useState } from 'react';
import AdminProductCard from '../../components/admin/AdminProductCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { productsApi } from '../../api/products.api.js';
import { useAdminCategories, useAdminProducts, useAdminVendors } from '../../hooks/useAdmin.js';
import { useUiStore } from '../../store/uiStore.js';

export default function AdminProductsPage() {
  const showToast = useUiStore((state) => state.showToast);
  const { vendors } = useAdminVendors();
  const { categories } = useAdminCategories();
  const [filters, setFilters] = useState({ vendor: '', category: '', search: '', active: '' });
  const params = useMemo(() => ({ ...filters, limit: 50 }), [filters]);
  const { products, refetch } = useAdminProducts(params);
  const [editing, setEditing] = useState(null);

  const update = async (product, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    await productsApi.update(product.id, formData);
    showToast('Product updated', 'success');
    refetch();
  };

  return (
    <>
      <TopHeader title="Products" subtitle={`${products.length} catalog items`} variant="dark" rightActions={[{ label: 'Add', icon: '➕', onClick: () => setEditing({}) }]} />
      <section className="section space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <select value={filters.vendor} onChange={(event) => setFilters({ ...filters, vendor: event.target.value })} className="h-11 rounded-2xl bg-white/10 px-3 text-sm font-bold text-white">
            <option value="">All vendors</option>
            {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.shop_name}</option>)}
          </select>
          <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} className="h-11 rounded-2xl bg-white/10 px-3 text-sm font-bold text-white">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
          </select>
        </div>
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search products" className="h-12 w-full rounded-3xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-white/50" />
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onEdit={() => setEditing(product)}
              onToggleActive={() => update(product, { is_active: !product.is_active })}
              onToggleFeatured={() => update(product, { is_featured: !product.is_featured })}
              onDelete={() => productsApi.delete(product.id).then(refetch)}
            />
          ))}
        </div>
      </section>
      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Product' : 'Add Product'}>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-brand-muted">Use the vendor product form for detailed add/edit. Admin vendor selector is ready above.</p>
          <Button fullWidth onClick={() => setEditing(null)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
