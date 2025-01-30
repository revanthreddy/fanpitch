/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1d4ed8', // MLB navy blue
          dark: '#172554',
          light: '#ffffff',
        },
        secondary: {
          DEFAULT: '#dc2626',
          light: '#dc2626',
        },
        chat: {
          user: {
            bg: '#1d4ed8', // Modern blue background
            text: '#ffffff', // White text for better contrast
            shadow: 'rgba(59, 130, 246, 0.1)', // Subtle blue shadow
          },
          message: {
            bg: '#ffffff', // Slightly off-white background
            text: '#334155', // Slate text
            shadow: 'rgba(0, 0, 0, 0.05)', // Subtle shadow
          },
          ai: {
            border: {
              from: '#dc2626', // Baseball red
              via: '#1d4ed8', // Baseball blue
              to: '#dc2626', // Baseball red
            },
            accent: '#dc2626', // Baseball red for stitching and indicators
            text: '#1e3a8a', // MLB navy blue for AI text
          },
        },
      },
      maxWidth: {
        container: '1000px',
        'ai-banner': '75%',
      },
      maxHeight: {
        textarea: '120px',
      },
      spacing: {
        'banner-padding': '1.5rem',
      },
      keyframes: {
        floatIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'float-in': 'floatIn 0.4s ease-out forwards',
      },
      boxShadow: {
        message: '0 2px 4px var(--tw-shadow-color)',
        avatar: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
