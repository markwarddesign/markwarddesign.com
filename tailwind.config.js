/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        // paper / ink — CSS-var driven so the .dark class flips them automatically.
        paper: {
          DEFAULT: 'rgb(var(--paper-rgb) / <alpha-value>)',
          50: 'rgb(var(--paper-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--paper-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--paper-200-rgb) / <alpha-value>)',
          300: 'rgb(var(--paper-300-rgb) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          900: 'rgb(var(--ink-900-rgb) / <alpha-value>)',
          700: 'rgb(var(--ink-700-rgb) / <alpha-value>)',
          500: 'rgb(var(--ink-500-rgb) / <alpha-value>)',
          400: 'rgb(var(--ink-400-rgb) / <alpha-value>)',
          300: 'rgb(var(--ink-300-rgb) / <alpha-value>)',
        },
        // Accents work on both modes; accent-50 swaps to a translucent dark-mode variant.
        accent: {
          DEFAULT: '#6366f1',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          50: 'rgb(var(--accent-50-rgb) / <alpha-value>)',
        },
        warm: {
          DEFAULT: '#f97316',
          500: '#f97316',
          600: '#ea580c',
          50: 'rgb(var(--warm-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--warm-100-rgb) / <alpha-value>)',
        },
        sage: {
          DEFAULT: '#475569',
          500: '#475569',
          50: 'rgb(var(--sage-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--sage-100-rgb) / <alpha-value>)',
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
