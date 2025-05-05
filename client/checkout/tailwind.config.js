/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-glow-blue': 'pulse-glow-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow-red': 'pulse-glow-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow-blue': {
          '0%, 100%': {
            'box-shadow': '0 0 15px rgba(56, 189, 248, 0.3), 0 0 30px rgba(56, 189, 248, 0.2)',
          },
          '50%': {
            'box-shadow': '0 0 25px rgba(56, 189, 248, 0.5), 0 0 50px rgba(56, 189, 248, 0.3)',
          },
        },
        'pulse-glow-red': {
          '0%, 100%': {
            'box-shadow': '0 0 15px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.2)',
          },
          '50%': {
            'box-shadow': '0 0 25px rgba(239, 68, 68, 0.5), 0 0 50px rgba(239, 68, 68, 0.3)',
          },
        },
      },
    },
  },
  plugins: [],
} 