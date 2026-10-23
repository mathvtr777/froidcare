/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#111317', // Base background
          900: '#171A21', // Surfaces, cards, panels
          850: '#1C2029', // Card elevate
          800: '#232834', // Secondary surfaces
          700: '#2F3646', // Hover states
          600: '#40495E', // Subtle borders
          500: '#58637E', // Distinct borders
        },
        sage: {
          50: '#F2F7F4',
          100: '#E1EDE6',
          200: '#C2DCcf',
          300: '#9EC4B2',
          400: '#76A993',
          500: '#528E75', // Brand primary accent
          600: '#41735E',
          700: '#345C4B',
          800: '#2B4A3D',
          900: '#243D32',
          950: '#12221C',
        },
        calm: {
          blue: '#4A729A',
          amber: '#B88648',
          rose: '#9E5B6A',
          purple: '#6E6294',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

