/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        charcoal: '#1C1F26',
        sage: {
          DEFAULT: '#7BA89C',
          soft: '#8FB89F',
        },
        sand: '#D4A574',
        rose: {
          dusty: '#C9A0A0',
        },
        ink: {
          DEFAULT: '#2D2A26',
          soft: '#6B6560',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        relaxed: '0.01em',
      },
      lineHeight: {
        relaxed: '1.6',
      },
      transitionTimingFunction: {
        gentle: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.85)', opacity: '0.28' },
          '50%': { transform: 'scale(1.15)', opacity: '0.42' },
        },
        softShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 0 0 rgba(143, 184, 159, 0.6)' },
          '100%': { boxShadow: '0 0 0 22px rgba(143, 184, 159, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        breathe: 'breathe 11s ease-in-out infinite',
        softShake: 'softShake 200ms ease-out 1',
        glow: 'glow 600ms ease-out 1',
        fadeIn: 'fadeIn 250ms ease-out 1',
      },
    },
  },
  plugins: [],
};
