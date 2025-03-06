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
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: 'var(--secondary-light)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
        },
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          300: 'var(--neutral-300)',
          700: 'var(--neutral-700)',
          900: 'var(--neutral-900)',
        },
        error: 'var(--error)',
        success: 'var(--success)',
      },
      fontFamily: {
        sans: ['var(--font-family)'],
      },
      spacing: {
        1: 'var(--spacing-1)',
        2: 'var(--spacing-2)',
        3: 'var(--spacing-3)',
        4: 'var(--spacing-4)',
        6: 'var(--spacing-6)',
        8: 'var(--spacing-8)',
        12: 'var(--spacing-12)',
        16: 'var(--spacing-16)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        focus: '0 0 0 3px rgba(66, 133, 244, 0.25)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '1': '1px',
        '1.5': '1.5px',
        '2': '2px',
      },
      backgroundImage: {
        'gradient-primary': 'var(--header-gradient)',
        'gradient-card': 'linear-gradient(90deg, var(--primary), var(--secondary))',
      },
      fontSize: {
        'star': '20px',
      },
      dropShadow: {
        'text': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'text-lg': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'icon': '0 1px 1px rgba(0, 0, 0, 0.05)',
      },
      textUnderlineOffset: {
        4: '4px',
      },
    },
  },
  plugins: [],
} 