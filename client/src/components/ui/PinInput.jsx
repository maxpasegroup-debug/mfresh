import { useRef } from 'react';

export default function PinInput({ length = 4, value, onChange }) {
  const refs = useRef([]);

  const handleChange = (index, nextValue) => {
    const digit = nextValue.replace(/\D/g, '').slice(-1);
    onChange(index, digit);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={value[index] || ''}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          inputMode="numeric"
          type="password"
          maxLength={1}
          className={`h-16 w-16 rounded-3xl border text-center text-2xl font-black outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 ${
            value[index]
              ? 'border-brand-green bg-brand-green text-white'
              : 'border-brand-border bg-white text-brand-text'
          }`}
        />
      ))}
    </div>
  );
}
