/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        areia: '#F5F1EA',
        neve: '#FBFAF7',
        salvia: {
          DEFAULT: '#7A9B7E',
          dark: '#5C7860',
          light: '#A0BFA4'
        },
        terracota: {
          DEFAULT: '#C97B5C',
          light: '#D89A7E'
        },
        nevoa: {
          DEFAULT: '#8FA7B5',
          light: '#A8BCC8'
        },
        grafite: '#3D3D3D',
        cinza: '#7A7A7A',
        carvao: '#1F1F1E',
        'cinza-escuro': '#2A2A28',
        'off-white': '#E8E5E0'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif']
      },
      borderRadius: {
        DEFAULT: '20px'
      },
      boxShadow: {
        soft: '0 4px 20px rgba(122, 155, 126, 0.08)',
        card: '0 2px 12px rgba(61, 61, 61, 0.06)'
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: []
};
