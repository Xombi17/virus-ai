/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A1128', // Deep midnight blue
          dark: '#050A18',
          light: '#1D3461',
        },
        secondary: {
          DEFAULT: '#00E5FF', // Cyan neon
          dark: '#00B8D4',
          light: '#6EFFFF',
        },
        accent: {
          DEFAULT: '#FF0055', // Magenta
          dark: '#CC0044',
          light: '#FF4D8C',
        },
        alert: {
          DEFAULT: '#FF7B00', // Warning orange
          dark: '#D66700',
          light: '#FFA04D',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)',
        'cyber-glow': 'linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(10, 17, 40, 0) 50%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'neon': '0 0 5px theme("colors.secondary.DEFAULT"), 0 0 20px rgba(0, 229, 255, 0.3)',
        'neon-hover': '0 0 10px theme("colors.secondary.DEFAULT"), 0 0 30px rgba(0, 229, 255, 0.5)',
        'neon-accent': '0 0 5px theme("colors.accent.DEFAULT"), 0 0 20px rgba(255, 0, 85, 0.3)',
        'neon-accent-hover': '0 0 10px theme("colors.accent.DEFAULT"), 0 0 30px rgba(255, 0, 85, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 229, 255, 0.5), 0 0 10px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 229, 255, 0.8), 0 0 20px rgba(0, 229, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
}; 