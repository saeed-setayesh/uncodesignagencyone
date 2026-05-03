import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Reference the CSS variable injected by next/font/google
        vazir: ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#16a34a',
          dark: '#15803d',
          light: '#f0fdf4',
        },
      },
    },
  },
  plugins: [typography],
}

export default config
