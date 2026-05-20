const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
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
        ink: {
          950: '#05080F',
          900: '#0A0E1A',
          800: '#0F172A',
          700: '#131C2E',
        },
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
      boxShadow: {
        'glow-emerald': '0 0 0 1px rgba(16,185,129,0.25), 0 0 24px -4px rgba(16,185,129,0.45)',
        'glow-cyan':    '0 0 0 1px rgba(6,182,212,0.25),  0 0 24px -4px rgba(6,182,212,0.45)',
        'glow-amber':   '0 0 0 1px rgba(245,158,11,0.30), 0 0 28px -4px rgba(245,158,11,0.55)',
        'glow-rose':    '0 0 0 1px rgba(244,63,94,0.25),  0 0 24px -4px rgba(244,63,94,0.45)',
        'cinema':       '0 24px 48px -16px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset',
      },
      animation: {
        'pulse-soft':  'pulse-soft 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':     'fade-in 200ms ease-out',
        'slide-down':  'slide-down 220ms ease-out',
        'fade-up':     'fade-up 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'grow-x':      'grow-x 900ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'shimmer':     'shimmer 2.6s linear infinite',
        'scan-x':      'scan-x 6s linear infinite',
        'spin-slow':   'spin 14s linear infinite',
        'glow-breath': 'glow-breath 3.6s ease-in-out infinite',
        'rise':        'rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.45' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grow-x': {
          '0%':   { transform: 'scaleX(0)', opacity: '0.4' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scan-x': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-breath': {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.4))' },
          '50%':      { filter: 'drop-shadow(0 0 14px rgba(16,185,129,0.8))' },
        },
        'rise': {
          '0%':   { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
