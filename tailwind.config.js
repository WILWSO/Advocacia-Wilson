/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Breakpoints responsivos personalizados
    screens: {
      'xs': '475px',    // Teléfonos pequeños
      'sm': '640px',    // Teléfonos grandes
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops
      'xl': '1280px',   // Desktop
      '2xl': '1536px',  // Large desktop
      '3xl': '1920px',  // Ultra wide
      // Breakpoints de altura
      'tall': { 'raw': '(min-height: 800px)' },
      'short': { 'raw': '(max-height: 600px)' },
      // Breakpoints de orientación
      'landscape': { 'raw': '(orientation: landscape)' },
      'portrait': { 'raw': '(orientation: portrait)' },
    },
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
        'custom-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'custom-xl': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      // Espaciado responsivo
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      // Anchos máximos personalizados
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Alturas de viewport para móviles
      height: {
        'screen-small': '100svh',
        'screen-dynamic': '100dvh',
      },
      minHeight: {
        'screen-small': '100svh',
        'screen-dynamic': '100dvh',
      },
      // Grid responsive mejorado
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
      },
      // Animaciones específicas para responsive
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};