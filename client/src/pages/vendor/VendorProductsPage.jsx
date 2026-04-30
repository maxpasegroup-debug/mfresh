import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ImageUpload from '../../components/shared/ImageUpload.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import SkeletonCard from '../../components/ui/SkeletonCard.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { productsApi } from '../../api/products.api.js';
import { useCategories } from '../../hooks/useProducts.js';
import { useAddProduct, useUpdateProduct, useVendorProducts } from '../../hooks/useVendorDashboard.js';
import { useUiStore } from '../../store/uiStore.js';

const emptyForm = {
  name: '',
  category_id: '',
  description: '',
  price: '',
  mrp: '',
  unit: '',
  stock: '',
};

export default function VendorProductsPage() {
  const [searchParams] = useSearchParams();
  const showToast = useUiStore((state) => state.showToast);
  const { categories } = useCategories();
  const { products, loading, refetch } = useVendorProducts();
  const { addProduct, loading: adding } = useAddProduct(refetch);
  const { updateProduct, loading: updating } = useUpdateProduct(refetch);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('active');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (searchParams.get('add')) setModal('add');
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = product.name?.toLowerCase().includes(query.toLowerCase());
        const matchesTab = tab === 'active' ? product.is_active !== false : product.is_active === false;
        return matchesQuery && matchesTab;
      }),
    [products, query, tab],
  );

  const toggleActive = async (product) => {
    const formData = new FormData();
    formData.append('is_active', String(!product.is_active));
    await updateProduct(product.id, formData);
  };

  const softDelete = async (product) => {
    try {
      await productsApi.delete(product.id);
      showToast('Product deleted', 'success');
      refetch();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not delete product', 'error');
    }
  };

  return (
    <>
      <TopHeader
        title="My Products"
        subtitle={`${products.length} products`}
        variant="orange"
        rightActions={[{ label: 'Add', icon: '➕', onClick: () => setModal('add') }]}
      />
      <section className="section space-y-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          className="h-12 w-full rounded-3xl border border-brand-border bg-white px-4 text-sm font-bold outline-none"
        />
        <div className="grid grid-cols-2 rounded-3xl bg-white p-1">
          {['active', 'inactive'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-2xl py-2 text-sm font-black capitalize ${tab === item ? 'bg-brand-orange text-white' : 'text-brand-muted'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
            : filtered.map((product) => (
                <ProductManageCard
                  key={product.id}
                  product={product}
                  onEdit={() => {
                    setEditing(product);
                    setModal('edit');
                  }}
                  onToggle={() => toggleActive(product)}
                  onDelete={() => softDelete(product)}
                />
              ))}
        </div>
      </section>
      <button
        type="button"
        onClick={() => setModal('add')}
        className="fixed bottom-24 right-[calc(50%-200px)] z-40 h-14 w-14 rounded-full bg-brand-orange text-2xl text-white shadow-btn"
      >
        +
      </button>
      <ProductModal
        isOpen={modal === 'add'}
        title="Add Product"
        categories={categories}
        loading={adding}
        onClose={() => setModal(null)}
        onSubmit={addProduct}
      />
      <ProductModal
        isOpen={modal === 'edit'}
        title="Edit Product"
        product={editing}
        categories={categories}
        loading={updating}
        onClose={() => setModal(null)}
        onSubmit={(formData) => updateProduct(editing.id, formData)}
        onDeleteImage={(publicId) => productsApi.deleteImage(editing.id, publicId).then(refetch)}
      />
    </>
  );
}

function ProductManageCard({ product, onEdit, onToggle, onDelete }) {
  const stock = Number(product.stock || 0);
  const badge =
    stock === 0
      ? ['Out of Stock', 'bg-red-100 text-red-700']
      : stock <= 5
        ? ['Low Stock', 'bg-orange-100 text-orange-700']
        : ['In Stock', 'bg-green-100 text-green-700'];
  const image = product.images?.[0]?.url || product.image_url;

  return (
    <article className="card overflow-hidden">
      <div className="h-28 bg-brand-bg">
        {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-4xl">🥬</div>}
      </div>
      <div className="space-y-2 p-3">
        <span className={`rounded-full px-2 py-1 text-[10px] font-black ${badge[1]}`}>{badge[0]}</span>
        <h3 className="line-clamp-2 text-sm font-black">{product.name}</h3>
        <p className="text-xs font-bold text-brand-muted">₹{product.price} • Stock {stock}</p>
        <div className="grid grid-cols-3 gap-2 text-xs font-black">
          <button type="button" onClick={onToggle} className="rounded-2xl bg-brand-bg py-2">{product.is_active ? 'Off' : 'On'}</button>
          <button type="button" onClick={onEdit} className="rounded-2xl bg-brand-yellow py-2">✎</button>
          <button type="button" onClick={onDelete} className="rounded-2xl bg-red-600 py-2 text-white">Del</button>
        </div>
      </div>
    </article>
  );
}

function ProductModal({ isOpen, title, product, categories, loading, onClose, onSubmit, onDeleteImage }) {
  const showToast = useUiStore((state) => state.showToast);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category_id: product.category_id || '',
        description: product.description || '',
        price: product.price || '',
        mrp: product.mrp || '',
        unit: product.unit || '',
        stock: product.stock || '',
      });
    } else setForm(emptyForm);
    setFiles([]);
  }, [product, isOpen]);

  const save = async () => {
    if (!form.name || !form.category_id || !form.price || !form.mrp || !form.unit || form.stock === '') {
      showToast('Fill all required fields', 'error');
      return;
    }
    if (Number(form.price) > Number(form.mrp)) {
      showToast('Price must be less than or equal to MRP', 'error');
      return;
    }
    if (!product && files.length === 0) {
      showToast('Add at least one image', 'error');
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    files.forEach((file) => formData.append('images', file));
    await onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-3">
        <Input label="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <select value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })} className="h-12 w-full rounded-2xl border border-brand-border px-3 font-bold">
          <option value="">Select category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="min-h-24 w-full rounded-2xl border border-brand-border p-3 font-semibold outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Price ₹" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} inputMode="decimal" />
          <Input label="MRP ₹" value={form.mrp} onChange={(event) => setForm({ ...form, mrp: event.target.value })} inputMode="decimal" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Unit" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
          <Input label="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} inputMode="numeric" />
        </div>
        <ImageUpload multiple maxFiles={5} existingImages={product?.images || []} onFilesSelected={setFiles} onDeleteExisting={onDeleteImage} />
        <Button fullWidth loading={loading} onClick={save}>Save Product</Button>
      </div>
    </Modal>
  );
}
