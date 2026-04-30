/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1a6b2f',
          greenLight: '#228B3E',
          greenDark: '#0f4a20',
          orange: '#e85d04',
          yellow: '#f5c800',
          fresh: '#6abf3e',
          bg: '#f4f7f4',
          card: '#ffffff',
          text: '#1a2e1a',
          muted: '#6b7c6b',
          border: '#e0ebe0',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        modal: '0 20px 60px rgba(0,0,0,0.2)',
        btn: '0 4px 16px rgba(26,107,47,0.35)',
      },
    },
  },
  plugins: [],
};
