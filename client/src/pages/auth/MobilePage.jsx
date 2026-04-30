import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function MobilePage() {
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a 10 digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    let purpose = 'login';

    try {
      await authApi.sendOtp(mobile, purpose);
    } catch (err) {
      if (err.response?.status === 404) {
        purpose = 'register';
        await authApi.sendOtp(mobile, purpose);
      } else {
        setLoading(false);
        showToast(err.response?.data?.message || 'Could not send OTP', 'error');
        return;
      }
    }

    sessionStorage.setItem('mb_auth_mobile', mobile);
    sessionStorage.setItem('mb_auth_purpose', purpose);
    navigate('/auth/otp');
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black text-brand-text">Welcome 👋</h2>
        <p className="mt-2 text-sm font-semibold text-brand-muted">Enter your mobile number</p>
      </div>
      <Input
        label="Mobile number"
        prefix="+91"
        value={mobile}
        onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
        error={error}
        inputMode="numeric"
        placeholder="9876543210"
      />
      <Button type="submit" fullWidth loading={loading}>
        Send OTP
      </Button>
      <div className="flex justify-between text-sm font-bold text-brand-green">
        <Link to="/auth/mobile">Vendor Login</Link>
        <Link to="/auth/mobile">Admin Login</Link>
      </div>
    </form>
  );
}
