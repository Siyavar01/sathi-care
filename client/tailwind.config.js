/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#A093E2',
        'pastel-pink': '#F4B6B4',
        'brand-cream': '#FAF3E8',
        'brand-charcoal': '#3A3A3A',
      },
      keyframes: {
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'draw-ring': {
          'from': { strokeDashoffset: '1000' },
          'to': { strokeDashoffset: '0' },
        },
        'fade-slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 15s ease infinite',
        'draw-ring': 'draw-ring 4s linear forwards',
        'fade-slide-down': 'fade-slide-down 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
};