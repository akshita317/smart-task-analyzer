/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#1e293b',
        accent: '#06b6d4',
        destructive: '#ef4444',
        muted: '#64748b',
        'muted-foreground': '#94a3b8',
        foreground: '#f1f5f9',
        background: '#0f172a',
        border: '#334155',
        ring: '#0ea5e9',
      },
      backgroundColor: {
        background: '#0f172a',
        card: '#1e293b',
      },
    },
  },
  plugins: [],
}

