import Spinner from './Spinner.jsx';

const variants = {
  primary: 'bg-gradient-to-r from-brand-green to-brand-greenLight text-white shadow-btn',
  secondary: 'border border-brand-green bg-white text-brand-green',
  danger: 'bg-red-600 text-white',
  ghost: 'bg-transparent text-brand-green',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${sizes[size]} ${variants[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className} inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? <Spinner size="sm" color="white" /> : null}
      {children}
    </button>
  );
}
