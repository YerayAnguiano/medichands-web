/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        mh: {
          primary: '#992173',
          'primary-dark': '#7b185b',
          'primary-light': '#b9338d',
          lavender: '#EBD6FF',
          'lavender-light': '#F3EAFB',
          white: '#FEFEFE',
          green: '#3D9F13',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            500: '#6B7280',
            700: '#374151',
            900: '#111827',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
  ],
};
