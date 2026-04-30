import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/shared/ImageUpload.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { vendorsApi } from '../../api/vendors.api.js';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function VendorProfilePage() {
  const navigate = useNavigate();
  const vendor = useAuthStore((state) => state.vendor);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useUiStore((state) => state.showToast);
  const [form, setForm] = useState({
    shop_name: vendor?.shop_name || '',
    description: vendor?.description || '',
    address: vendor?.address || '',
    city: vendor?.city || '',
    pincode: vendor?.pincode || '',
    gst_number: vendor?.gst_number || '',
    bank_account_name: vendor?.bank_account_name || '',
    bank_account_number: vendor?.bank_account_number || '',
    bank_ifsc: vendor?.bank_ifsc || '',
  });
  const [logo, setLogo] = useState([]);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value || ''));
      if (logo[0]) formData.append('image', logo[0]);
      await vendorsApi.update(vendor.id, formData);
      showToast('Profile saved', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const forgotPin = () => {
    sessionStorage.setItem('mb_auth_mobile', user.mobile);
    sessionStorage.setItem('mb_auth_purpose', 'forgot_pin');
    navigate('/auth/otp');
  };

  return (
    <>
      <TopHeader title="Profile" subtitle="Shop details and bank account" variant="orange" />
      <header className="bg-gradient-to-br from-brand-orange to-amber-500 px-4 py-5 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-4xl bg-white/20 text-4xl">
            {vendor?.logo_url ? <img src={vendor.logo_url} alt={vendor.shop_name} className="h-full w-full object-cover" /> : '🏪'}
          </div>
          <div><h1 className="font-display text-3xl font-black">{vendor?.shop_name}</h1><p className="text-sm font-bold text-white/80">★ {vendor?.rating || 0} • {vendor?.total_orders || 0} orders</p></div>
        </div>
      </header>
      <section className="section space-y-4">
        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-black">Edit Shop Info</h2>
          {['shop_name', 'description', 'address', 'city', 'pincode', 'gst_number'].map((field) => (
            <Input key={field} label={field.replaceAll('_', ' ')} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
          ))}
          <ImageUpload onFilesSelected={setLogo} existingImages={vendor?.logo_url ? [{ url: vendor.logo_url, public_id: 'logo' }] : []} />
          <Button fullWidth loading={saving} onClick={save}>Save</Button>
        </div>
        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-black">Bank Details</h2>
          {['bank_account_name', 'bank_account_number', 'bank_ifsc'].map((field) => (
            <Input key={field} label={field.replaceAll('_', ' ')} value={field === 'bank_account_number' ? String(form[field]).replace(/\d(?=\d{4})/g, '*') : form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
          ))}
        </div>
        <div className="card space-y-3 p-4">
          <p className="text-sm font-bold text-brand-muted">Mobile: +91 {user?.mobile}</p>
          <Button variant="secondary" fullWidth onClick={forgotPin}>Change PIN</Button>
        </div>
        <Button variant="danger" fullWidth onClick={logout}>Sign Out</Button>
      </section>
    </>
  );
}
