import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import Button from '../../components/ui/Button.jsx';
import PinInput from '../../components/ui/PinInput.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function SetPinPage() {
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const [pin, setPin] = useState(Array(4).fill(''));
  const [confirmPin, setConfirmPin] = useState(Array(4).fill(''));
  const [loading, setLoading] = useState(false);

  const change = (setter) => (index, value) => {
    setter((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const continueNext = () => {
    const first = pin.join('');
    const second = confirmPin.join('');
    if (!/^\d{4}$/.test(first) || first !== second) {
      showToast('PINs must be 4 digits and match', 'error');
      return;
    }
    if (sessionStorage.getItem('mb_auth_purpose') === 'forgot_pin') {
      setLoading(true);
      authApi
        .resetPin(first, sessionStorage.getItem('mb_otp_token') || '')
        .then(() => {
          showToast('PIN updated', 'success');
          sessionStorage.setItem('mb_auth_purpose', 'login');
          navigate('/auth/pin');
        })
        .catch((error) => {
          showToast(error.response?.data?.message || 'Could not reset PIN', 'error');
          setLoading(false);
        });
      return;
    }

    sessionStorage.setItem('mb_auth_pin', first);
    navigate('/auth/role');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black text-brand-text">Create your PIN 🔒</h2>
        <p className="mt-2 text-sm font-semibold text-brand-muted">Set a 4-digit PIN for quick login</p>
      </div>
      <PinInput value={pin} onChange={change(setPin)} />
      <PinInput value={confirmPin} onChange={change(setConfirmPin)} />
      <Button fullWidth loading={loading} onClick={continueNext}>
        Continue
      </Button>
    </div>
  );
}
