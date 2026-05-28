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
          50: '#F5EFE6',
          100: '#E5D7C4',
          200: '#CFBB99',
          300: '#CFBB99',
          400: '#CFBB99',
        },
        coral: {
          50: '#F5F0E8',
          100: '#E8DCC8',
          200: '#CFBB99',
          300: '#8A6D3E',
          400: '#6B5220',
          500: '#4C3D19',
          600: '#3A2D10',
        },
        sage: {
          50: '#E8EDE0',
          100: '#C8D4B0',
          200: '#A8B888',
          300: '#889063',
          400: '#6B7A45',
          500: '#354024',
          600: '#2A3318',
        },
        warm: {
          50: '#F5EFE6',
          100: '#E5D7C4',
          200: '#CFBB99',
          300: '#B89870',
          400: '#8A6D3E',
          500: '#6B5220',
          600: '#4C3D19',
          700: '#354024',
          800: '#4C3D19',
          900: '#2A3318',
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
        'warm-gradient': 'linear-gradient(135deg, #E5D7C4 0%, #E8EDE0 50%, #CFBB99 100%)',
        'coral-gradient': 'linear-gradient(135deg, #FAE4DF 0%, #F4C5BB 100%)',
        'sage-gradient': 'linear-gradient(135deg, #C8D4B0 0%, #889063 100%)',
      },
    },
  },
  plugins: [],
}

export default config
