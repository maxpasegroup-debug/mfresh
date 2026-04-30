import { useState } from 'react';
import ImageUpload from '../../components/shared/ImageUpload.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { categoriesApi } from '../../api/categories.api.js';
import { useAdminCategories } from '../../hooks/useAdmin.js';
import { useUiStore } from '../../store/uiStore.js';

export default function AdminCategoriesPage() {
  const showToast = useUiStore((state) => state.showToast);
  const { categories, refetch } = useAdminCategories();
  const [modal, setModal] = useState(null);

  const toggle = async (category) => {
    const data = new FormData();
    data.append('is_active', String(!category.is_active));
    await categoriesApi.update(category.id, data);
    refetch();
  };

  const remove = async (category) => {
    try {
      await categoriesApi.delete(category.id);
      showToast('Category deleted', 'success');
      refetch();
    } catch (error) {
      showToast(error.response?.data?.message || 'Cannot delete: products exist', 'error');
    }
  };

  return (
    <>
      <TopHeader title="Categories" subtitle="Aisles and sorting" variant="dark" rightActions={[{ label: 'Add', icon: '➕', onClick: () => setModal({}) }]} />
      <section className="section space-y-3">
        {categories.map((category, index) => (
          <article key={category.id} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-2xl bg-white/10">{category.image_url ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center">🥬</span>}</div>
              <div className="min-w-0 flex-1"><h3 className="font-black">{category.name}</h3><p className="text-xs text-white/60">{category.slug}</p></div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-black">{category.product_count || 0}</span>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 text-xs font-black">
              <button type="button" onClick={() => toggle(category)} className="rounded-2xl bg-white/10 py-2">{category.is_active ? 'On' : 'Off'}</button>
              <button type="button" onClick={() => setModal(category)} className="rounded-2xl bg-white/10 py-2">✎</button>
              <button type="button" onClick={() => remove(category)} className="rounded-2xl bg-red-600 py-2">🗑</button>
              <button type="button" className="rounded-2xl bg-white/10 py-2">↑</button>
              <button type="button" className="rounded-2xl bg-white/10 py-2" disabled={index === categories.length - 1}>↓</button>
            </div>
          </article>
        ))}
      </section>
      <CategoryModal category={modal} isOpen={Boolean(modal)} onClose={() => setModal(null)} onSaved={refetch} />
    </>
  );
}

function CategoryModal({ category, isOpen, onClose, onSaved }) {
  const showToast = useUiStore((state) => state.showToast);
  const [name, setName] = useState(category?.name || '');
  const [sortOrder, setSortOrder] = useState(category?.sort_order || 0);
  const [active, setActive] = useState(category?.is_active ?? true);
  const [files, setFiles] = useState([]);

  const save = async () => {
    const data = new FormData();
    data.append('name', name);
    data.append('sort_order', sortOrder);
    data.append('is_active', String(active));
    if (files[0]) data.append('image', files[0]);
    if (category?.id) await categoriesApi.update(category.id, data);
    else await categoriesApi.create(data);
    showToast('Category saved', 'success');
    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category?.id ? 'Edit Category' : 'Add Category'}>
      <div className="space-y-3">
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="Sort order" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active</label>
        <ImageUpload onFilesSelected={setFiles} existingImages={category?.image_url ? [{ url: category.image_url, public_id: 'category' }] : []} />
        <Button fullWidth onClick={save}>Save</Button>
      </div>
    </Modal>
  );
}
