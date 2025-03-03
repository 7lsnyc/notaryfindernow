/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'trust-blue': '#1E90FF',
        'fresh-green': '#32CD32',
        'warm-gray': '#D3D3D3',
        'bright-yellow': '#FFD700',
        'yellow-hover': '#FFC107',
        'background': '#F5F5F5',
      },
      fontFamily: {
        'poppins': ['Poppins', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': '32px',
        'h2': '24px',
        'body': '16px',
      },
      borderRadius: {
        'button': '8px',
        'pill': '9999px',
      },
      padding: {
        'badge': '12px',
      },
    },
  },
  plugins: [],
} 