/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50, #fcf8f2)',
          100: 'var(--brand-100, #f7efe0)',
          200: 'var(--brand-200, #eedebd)',
          300: 'var(--brand-300, #e2c694)',
          400: 'var(--brand-400, #d5a968)',
          500: 'var(--brand-500, #c89146)',
          600: 'var(--brand-600, #b27638)',
          700: 'var(--brand-700, #915a2f)',
          800: 'var(--brand-800, #77492c)',
          900: 'var(--brand-900, #633e28)',
          950: 'var(--brand-950, #382013)',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
