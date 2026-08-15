/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goa: {
          green: '#0B6839',
          mid: '#084E2A',
          dark: '#04321A',
          deep: '#032011',
          light: '#9AC95F',
          pale: '#CDE5A8',
        },
        hh: {
          yellow: '#FEE101',
          gold: '#EDD723',
          pink: '#FF0080',
          hotpink: '#FF1493',
          orange: '#FF6B00',
        },
        cream: {
          DEFAULT: '#FFFDF5',
          dark: '#FAF3E0',
          muted: '#F0E6CE',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        heading: ['"Cabinet Grotesk"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-pink': '4px 4px 0px 0px #FF0080',
        'brutal-yellow': '4px 4px 0px 0px #FEE101',
        'brutal-green': '4px 4px 0px 0px #0B6839',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
