/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0077C8',
          greenLight: '#00A99D',
          greenDark: '#001727',
          orange: '#FF7A1A',
          yellow: '#D7F8FF',
          fresh: '#00A99D',
          bg: '#F4FBFF',
          card: '#ffffff',
          text: '#001727',
          muted: '#507083',
          border: '#D8ECF5',
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
        card: '0 8px 28px rgba(0,59,92,0.08)',
        modal: '0 24px 70px rgba(0,23,39,0.28)',
        btn: '0 10px 24px rgba(0,119,200,0.32)',
      },
    },
  },
  plugins: [],
};
