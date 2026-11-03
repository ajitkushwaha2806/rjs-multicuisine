/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#14532D',
          900: '#0F3D24',
          950: '#0A2918',
        },
        burgundy: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#14532D',
          900: '#0F3D24',
          950: '#0A2918',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F7F0D4',
          200: '#EFE1A7',
          300: '#E5CD75',
          400: '#DDBB4E',
          500: '#D4AF37', // primary gold
          600: '#B79024',
          700: '#926F1D',
          800: '#75561E',
          900: '#62461D',
        },
        cream: {
          50: '#FFFEFC',
          100: '#FDFBF7',
          200: '#F9F5EC',
          300: '#F3EDE0',
          400: '#EAE1CE',
          500: '#DDD0B7',
        },
        dark: {
          850: '#1A1718',
          900: '#141213',
          950: '#0C0A0B',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(10, 41, 24, 0.18)',
        'luxury-gold': '0 15px 35px -10px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
