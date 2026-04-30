import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

const roles = [
  { id: 'individual', title: 'Individual', emoji: '🏠', mode: 'individual' },
  { id: 'hotel', title: 'Hotel', emoji: '🍽️', mode: 'hotel' },
  { id: 'vendor', title: 'Vendor', emoji: '🏪', mode: 'individual' },
];

export default function RolePage() {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const showToast = useUiStore((state) => state.showToast);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('individual');
  const [loading, setLoading] = useState(false);

  const continueNext = async () => {
    const role = roles.find((item) => item.id === selected);
    const pin = sessionStorage.getItem('mb_auth_pin') || '';
    const otpToken = sessionStorage.getItem('mb_otp_token') || '';

    if (name.trim().length < 2) {
      showToast('Enter your name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.setPin(name.trim(), pin, role.mode, otpToken);
      loginSuccess(response.data);
      const userRole = response.data.user.role;
      navigate(userRole === 'admin' ? '/admin' : userRole === 'vendor' ? '/vendor-dashboard' : '/home');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not create account', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black text-brand-text">Who are you?</h2>
        <p className="mt-2 text-sm font-semibold text-brand-muted">Choose the best account mode</p>
      </div>
      <Input label="Your name" value={name} onChange={(event) => setName(event.target.value)} />
      <div className="grid gap-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setSelected(role.id)}
            className={`flex items-center gap-4 rounded-3xl border p-4 text-left transition ${
              selected === role.id
                ? 'border-brand-green bg-brand-green text-white'
                : 'border-brand-border bg-white text-brand-text'
            }`}
          >
            <span className="text-3xl">{role.emoji}</span>
            <span className="text-lg font-black">{role.title}</span>
          </button>
        ))}
      </div>
      <Button fullWidth loading={loading} onClick={continueNext}>
        Continue
      </Button>
    </div>
  );
}
