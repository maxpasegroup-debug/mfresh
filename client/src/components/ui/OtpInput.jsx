import { useRef } from 'react';

export default function OtpInput({ length = 6, value, onChange }) {
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
    <div className="flex justify-between gap-2">
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
          maxLength={1}
          className="h-[52px] w-[52px] rounded-2xl border border-brand-border bg-white text-center text-xl font-black text-brand-text outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        />
      ))}
    </div>
  );
}
