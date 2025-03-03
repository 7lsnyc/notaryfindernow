import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'trust-blue': '#1E90FF',
        'dark-blue': '#00008B',
        'trust-green': '#32CD32',
        'trust-yellow': '#FFD700',
        'trust-grey': '#E5E7EB',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
}

export default config 