import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function RolePage() {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const showToast = useUiStore((state) => state.showToast);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const continueNext = async () => {
    const pin = sessionStorage.getItem('mb_auth_pin') || '';
    const otpToken = sessionStorage.getItem('mb_otp_token') || '';

    if (name.trim().length < 2) {
      showToast('Enter your name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.setPin(name.trim(), pin, 'individual', otpToken);
      loginSuccess(response.data);
      navigate('/home');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not create account', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black text-brand-text">Create your MFresh account</h2>
        <p className="mt-2 text-sm font-semibold text-brand-muted">Fresh seafood orders will be saved to this profile.</p>
      </div>
      <Input label="Your name" value={name} onChange={(event) => setName(event.target.value)} />
      <div className="rounded-3xl border border-brand-border bg-white p-4">
        <p className="text-sm font-black text-brand-text">Customer account</p>
        <p className="mt-1 text-xs font-bold text-brand-muted">Direct MFresh seafood ordering with weight, cleaning, and delivery slot preferences.</p>
      </div>
      <Button fullWidth loading={loading} onClick={continueNext}>
        Continue
      </Button>
    </div>
  );
}
