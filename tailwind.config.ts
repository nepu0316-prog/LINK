import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF7',
          100: '#FAF4EC',
          200: '#F5E6D3',
          300: '#EDD5B8',
          400: '#E0C09A',
        },
        coral: {
          50: '#FEF3F1',
          100: '#FAE4DF',
          200: '#F4C5BB',
          300: '#E8610A',
          400: '#DC8571',
          500: '#C96550',
          600: '#A84A38',
        },
        sage: {
          50: '#EEF7F4',
          100: '#D4EAE4',
          200: '#A8D5CA',
          300: '#7FB5A2',
          400: '#5D9A8A',
          500: '#3D7A6A',
          600: '#2D5E52',
        },
        warm: {
          50: '#FAF6F3',
          100: '#F5EDE6',
          200: '#E8D5C9',
          300: '#D4B5A3',
          400: '#B88A75',
          500: '#8C6355',
          600: '#6B4C3B',
          700: '#4A3028',
          800: '#3D2B1F',
          900: '#2D1E14',
        },
        sand: {
          100: '#F9F0E3',
          200: '#F0E0C8',
          300: '#E5CBA8',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'Noto Sans TC', 'sans-serif'],
        display: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(109, 76, 59, 0.08), 0 4px 6px -4px rgba(109, 76, 59, 0.05)',
        card: '0 4px 20px -4px rgba(109, 76, 59, 0.12), 0 2px 8px -2px rgba(109, 76, 59, 0.08)',
        hover: '0 8px 30px -4px rgba(109, 76, 59, 0.18), 0 4px 12px -2px rgba(109, 76, 59, 0.1)',
        glow: '0 0 20px rgba(232, 165, 152, 0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'dots-pattern': "radial-gradient(circle, #E8D5C9 1px, transparent 1px)",
        'warm-gradient': 'linear-gradient(135deg, #FDFAF7 0%, #FAF4EC 50%, #F5E6D3 100%)',
        'coral-gradient': 'linear-gradient(135deg, #FAE4DF 0%, #F4C5BB 100%)',
        'sage-gradient': 'linear-gradient(135deg, #D4EAE4 0%, #A8D5CA 100%)',
      },
    },
  },
  plugins: [],
}

export default config
