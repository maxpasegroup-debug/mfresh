import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import PinInput from '../../components/ui/PinInput.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function PinPage() {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const showToast = useUiStore((state) => state.showToast);
  const [pin, setPin] = useState(Array(4).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const mobile = sessionStorage.getItem('mb_auth_mobile') || '';
  const otpToken = sessionStorage.getItem('mb_otp_token') || '';

  const changePin = (index, value) => {
    const next = [...pin];
    next[index] = value;
    setPin(next);
  };

  useEffect(() => {
    const code = pin.join('');
    if (code.length !== 4 || submitting) return;

    setSubmitting(true);
    authApi
      .loginWithPin(mobile, code, otpToken)
      .then((response) => {
        loginSuccess(response.data);
        const role = response.data.user.role;
        navigate(role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor-dashboard' : '/home');
      })
      .catch((error) => {
        showToast(error.response?.data?.message || 'Invalid PIN', 'error');
        setSubmitting(false);
        setPin(Array(4).fill(''));
      });
  }, [pin, submitting, mobile, otpToken, loginSuccess, navigate, showToast]);

  const forgotPin = async () => {
    await authApi.sendOtp(mobile, 'forgot_pin');
    sessionStorage.setItem('mb_auth_purpose', 'forgot_pin');
    navigate('/auth/otp');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black text-brand-text">Enter PIN 🔑</h2>
        <p className="mt-2 text-sm font-semibold text-brand-muted">Unlock your Malabarii account</p>
      </div>
      <PinInput value={pin} onChange={changePin} />
      <button type="button" onClick={forgotPin} className="w-full text-sm font-bold text-brand-orange">
        Forgot PIN?
      </button>
      <Link to="/auth/mobile" className="block text-center text-sm font-bold text-brand-green">
        Use another mobile number
      </Link>
    </div>
  );
}
