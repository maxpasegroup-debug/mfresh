import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import TopHeader from '../../components/ui/TopHeader.jsx';
import { api, publicApi } from '../../api/http.js';
import { useUiStore } from '../../store/uiStore.js';

export default function AdminSettingsPage() {
  const showToast = useUiStore((state) => state.showToast);
  const [settings, setSettings] = useState(null);
  const [mobile, setMobile] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [delivery, setDelivery] = useState({ free_delivery_min: 199, default_delivery_fee: 30, zones: 'Kochi' });

  useEffect(() => {
    api.get('/api/admin/settings').then((response) => {
      setSettings(response.data);
      setDelivery({
        free_delivery_min: response.data.delivery.free_delivery_min,
        default_delivery_fee: response.data.delivery.default_delivery_fee,
        zones: response.data.delivery.zones.join(', '),
      });
    });
  }, []);

  const saveDelivery = async () => {
    await api.post('/api/admin/settings', { delivery });
    showToast('Settings saved', 'success');
  };

  const sendTestOtp = async () => {
    await publicApi.post('/api/auth/send-otp', { mobile, purpose: 'login' });
    showToast('Test OTP sent', 'success');
  };

  const createAdmin = async () => {
    await api.post('/api/admin/create-admin', { mobile: adminMobile, name: 'Admin' });
    showToast('Admin created', 'success');
    setAdminMobile('');
  };

  return (
    <>
      <TopHeader title="Settings ⚙️" subtitle="Platform configuration" variant="dark" />
      <section className="section space-y-4">
        <Panel title="Delivery">
          <Input label="Free delivery min" value={delivery.free_delivery_min} onChange={(event) => setDelivery({ ...delivery, free_delivery_min: event.target.value })} />
          <Input label="Default delivery fee" value={delivery.default_delivery_fee} onChange={(event) => setDelivery({ ...delivery, default_delivery_fee: event.target.value })} />
          <Input label="Delivery zones" value={delivery.zones} onChange={(event) => setDelivery({ ...delivery, zones: event.target.value })} />
          <Button fullWidth onClick={saveDelivery}>Save Delivery</Button>
        </Panel>
        <Panel title="Payment">
          <p>Razorpay Key: {settings?.payment?.razorpay_key_id}</p>
          <p>Mode: {settings?.payment?.mode}</p>
          <p>Webhook: {settings?.payment?.webhook_url}</p>
        </Panel>
        <Panel title="Notifications">
          <p>MSG91 Sender: {settings?.notifications?.msg91_sender_id || 'Not set'}</p>
          <Input label="Test mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} />
          <Button onClick={sendTestOtp}>Send Test OTP</Button>
        </Panel>
        <Panel title="Admin Accounts">
          <Input label="New admin mobile" value={adminMobile} onChange={(event) => setAdminMobile(event.target.value)} />
          <Button onClick={createAdmin}>Add Admin</Button>
        </Panel>
        <Panel title="App Info">
          <p>Version: {settings?.app?.version}</p>
          <p>Schema: {settings?.app?.schema_version}</p>
          <p>Server uptime: {Math.round(settings?.app?.uptime || 0)}s</p>
        </Panel>
      </section>
    </>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-white">
      <h2 className="mb-3 text-lg font-black">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
