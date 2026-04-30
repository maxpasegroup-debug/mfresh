import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export default function PromoCodeInput({ onApply, discount, loading }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const apply = async () => {
    setMessage('');
    try {
      await onApply(code.trim());
      setMessage('Promo applied');
    } catch (error) {
      setMessage(error.message || 'Invalid promo code');
    }
  };

  return (
    <div className="card p-4">
      <div className="flex gap-2">
        <Input
          className="flex-1"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Promo code"
        />
        <Button loading={loading} onClick={apply}>
          Apply
        </Button>
      </div>
      {discount ? <p className="mt-2 text-sm font-bold text-brand-green">Discount: ₹{discount}</p> : null}
      {message ? <p className="mt-2 text-xs font-bold text-brand-muted">{message}</p> : null}
    </div>
  );
}
