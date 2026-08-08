/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#090d16',
          900: '#0f172a',
          850: '#131c31',
          800: '#1e293b',
          700: '#334155',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        accent: {
          indigo: '#6366f1',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          emerald: '#22c55e',
          purple: '#a855f7',
        },
        dark: {
          bg: '#090d16',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(30, 41, 59, 0.8)',
          accent: '#131c31',
          muted: '#64748b'
        },
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          accent: '#f1f5f9',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(34, 197, 94, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'glass-heavy': '0 8px 32px 0 rgba(0, 0, 0, 0.47)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}

