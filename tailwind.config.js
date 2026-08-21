/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg-solid)',
        surface: 'var(--color-surface)',
        'surface-light': 'var(--color-surface-raised)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-strong)',
        primary: 'var(--color-accent)',
        'primary-hover': 'var(--color-accent-hover)',
        'primary-active': 'var(--color-accent-active)',
        text: 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        accent: 'var(--color-glow)',
        'accent-soft': 'var(--color-glow-soft)',
        warning: 'var(--color-warning)',
        error: 'var(--color-danger)',
        success: 'var(--color-success)',
        teal: {
          300: 'var(--brand-teal-300)',
          400: 'var(--brand-teal-400)',
          500: 'var(--brand-teal-500)',
          600: 'var(--brand-teal-600)',
          700: 'var(--brand-teal-700)',
        },
        ink: {
          850: 'var(--ink-850)',
          900: 'var(--ink-900)',
          950: 'var(--ink-950)',
        },
        violet: {
          600: 'var(--violet-600)',
          700: 'var(--violet-700)',
          800: 'var(--violet-800)',
        },
      },
      fontFamily: {
        sans: ['Golos Text', 'Golos UI', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        accent: ['Old Standard TT', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glass: 'var(--glass-shadow)',
        glow: 'var(--glow-ring)',
      },
      backdropBlur: {
        glass: 'var(--glass-blur)',
        'glass-reduced': 'var(--glass-blur-reduced)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        out: 'var(--ease-out)',
        bounce: 'var(--ease-bounce)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '250ms',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.5s ease-in-out infinite',
        'fog-pulse': 'fog-pulse 2400ms ease-in-out infinite',
        'bounce-in': 'bounce-in 500ms var(--ease-bounce)',
      },
      keyframes: {
        typing: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
        'fog-pulse': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 0.85 },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.85)', opacity: 0 },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
