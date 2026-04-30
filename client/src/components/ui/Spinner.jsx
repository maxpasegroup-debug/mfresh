const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
};

const colors = {
  green: 'border-brand-green/20 border-t-brand-green',
  white: 'border-white/30 border-t-white',
  orange: 'border-brand-orange/20 border-t-brand-orange',
};

export default function Spinner({ size = 'md', color = 'green' }) {
  return (
    <span
      className={`${sizes[size]} ${colors[color] || colors.green} inline-block animate-spin rounded-full`}
    />
  );
}
