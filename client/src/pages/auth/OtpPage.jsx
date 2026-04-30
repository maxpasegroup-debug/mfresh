import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import Button from '../../components/ui/Button.jsx';
import OtpInput from '../../components/ui/OtpInput.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function OtpPage() {
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const mobile = sessionStorage.getItem('mb_auth_mobile') || '';
  const purpose = sessionStorage.getItem('mb_auth_purpose') || 'login';

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const changeOtp = (index, value) => {
    const next = [...otp];
    next[index] = value;
    setOtp(next);
  };

  const submit = async () => {
    const code = otp.join('');
    if (!/^\d{6}$/.test(code)) {
      showToast('Enter the 6 digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOtp(mobile, code, purpose);
      sessionStorage.setItem('mb_otp_token', response.data.otpToken);
      navigate(response.data.isNewUser || purpose === 'forgot_pin' ? '/auth/set-pin' : '/auth/pin');
    } catch (error) {
      showToast(error.response?.data?.message || 'Invalid OTP', 'error');
      setLoading(false);
    }
  };

  const resend = async () => {
    await authApi.sendOtp(mobile, purpose);
    setSeconds(60);
    showToast('OTP resent', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black text-brand-text">Verify OTP 🔐</h2>
        <p className="mt-2 text-sm font-semibold text-brand-muted">Sent to +91 {mobile}</p>
      </div>
      <OtpInput value={otp} onChange={changeOtp} />
      <Button fullWidth loading={loading} onClick={submit}>
        Verify
      </Button>
      <button
        type="button"
        disabled={seconds > 0}
        onClick={resend}
        className="w-full text-sm font-bold text-brand-green disabled:text-brand-muted"
      >
        {seconds > 0 ? `Resend in ${seconds}s` : 'Resend OTP'}
      </button>
    </div>
  );
}
