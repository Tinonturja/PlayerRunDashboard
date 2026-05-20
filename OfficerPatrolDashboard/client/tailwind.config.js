const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use absolute paths so this config works whether Tailwind is invoked from
  // the workspace root (npm run client) or from within the client/ folder.
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Operation palette (mirrors src/lib/colors.js)
        op: {
          tob:       '#BA7517',
          eldp:      '#1D9E75',
          ildp:      '#378ADD',
          milldp:    '#7F77DD',
          isdp:      '#1AACBF',
          milsdp:    '#D85A30',
          ldap:      '#639922',
          idap:      '#D4537E',
          fpunisfa:  '#E24B4A',
          fpother:   '#9F60C8',
          ctptl:     '#1D7A6E',
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'slide-down': 'slide-down 220ms ease-out',
        'grow-x': 'grow-x 700ms cubic-bezier(0.4, 0, 0.2, 1) both',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grow-x': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
};
