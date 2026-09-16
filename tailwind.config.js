/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,lib,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  safelist: [
    'bg-store-navy',
    'bg-store-navy-light',
    'bg-store-surface',
    'text-store-navy',
    'text-store-ink',
    'border-store-navy',
    'hover:bg-store-navy',
    'hover:bg-store-navy-light',
    'hover:bg-store-surface',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          espresso: '#1B3A2F',
          nude: '#EEF2E9',
          champagne: '#D8B47F',
          mauve: '#718075',
          rose: '#718075',
          cream: '#F7F3EB',
          cocoa: '#254535',
          DEFAULT: '#1B3A2F',
          light: '#EEF2E9',
          dark: '#254535',
          accent: '#D8B47F',
        },
        store: {
          navy: '#1B3A2F',
          'navy-light': '#2D5A3D',
          primary: '#1B3A2F',
          'primary-dark': '#142920',
          ink: '#254535',
          muted: '#718075',
          surface: '#EEF2E9',
        },
      },
      letterSpacing: {
        'widest-lg': '0.2em',
        'widest-xl': '0.3em',
      },
      boxShadow: {
        luxury: '0 10px 40px -10px rgba(27, 58, 47, 0.10)',
        'luxury-lg': '0 20px 60px -15px rgba(27, 58, 47, 0.14)',
        soft: '0 8px 30px -12px rgba(45, 90, 61, 0.18)',
      },
      transitionDuration: {
        luxury: '500ms',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        shimmer: 'shimmer 3s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
