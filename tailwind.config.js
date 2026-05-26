/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#ffffff',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
        },
        ink: {
          DEFAULT: '#0a0a0b',
          900: '#0a0a0b',
          700: '#27272a',
          500: '#52525b',
          400: '#71717a',
          300: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#6366f1',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          50: '#eef2ff',
        },
        warm: {
          DEFAULT: '#f97316',
          500: '#f97316',
          600: '#ea580c',
          50: '#fff7ed',
          100: '#ffedd5',
        },
        sage: {
          DEFAULT: '#475569',
          500: '#475569',
          50: '#f1f5f9',
          100: '#e2e8f0',
        },
        signal: {
          warm: '#f97316',
        },
      },
      letterSpacing: {
        tightish: '-0.01em',
        tighter2: '-0.025em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
