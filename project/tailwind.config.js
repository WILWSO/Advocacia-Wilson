/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F0F4FA',
          100: '#D5E0F1',
          200: '#AABFDF',
          300: '#7D9DCB',
          400: '#5278B7',
          500: '#3A5A98',
          600: '#2E4C82',
          700: '#233D6B',
          800: '#182F54',
          900: '#0F172A',
        },
        gold: {
          50: '#FFFAEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FBBF24',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B59410',
          700: '#92400E',
          800: '#7C2D12',
          900: '#7C2A0F',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};