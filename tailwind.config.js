/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a', // MLB navy blue
          dark: '#172554',
        },
        chat: {
          user: {
            bg: '#eff6ff', // Light blue background
            text: '#1e3a8a', // MLB navy blue
          },
          bot: {
            bg: '#f8fafc', // Light gray background
            text: '#334155', // Slate text
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
    },
  },
  plugins: [],
};
