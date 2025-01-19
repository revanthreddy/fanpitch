/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196f3',
          dark: '#1976d2',
        },
        chat: {
          user: {
            bg: '#e3f2fd',
            text: '#1565c0',
          },
          bot: {
            bg: '#f5f5f5',
            text: '#333333',
          },
        },
      },
      maxWidth: {
        container: '1000px',
      },
      maxHeight: {
        textarea: '120px',
      },
    },
  },
  plugins: [],
};
