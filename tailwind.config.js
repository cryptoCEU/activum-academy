/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'act-black':  '#1E1D16',
        'act-white':  '#F7F2EA',
        'act-beige1': '#EDE3D8',
        'act-beige2': '#D9C9B8',
        'act-beige3': '#C4B09A',
        'act-burg':   '#8C1736',
        'act-burg-d': '#6E1129',
        'act-burg-l': '#A81D42',
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(30,29,22,0.08), 0 4px 16px rgba(30,29,22,0.06)',
        'card-hover': '0 4px 12px rgba(30,29,22,0.12), 0 16px 40px rgba(30,29,22,0.10)',
      }
    },
  },
  plugins: [],
}
