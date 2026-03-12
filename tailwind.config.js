
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trust-blue': 'var(--trust-blue)',
      },
      backgroundColor: {
        'sidebar': 'var(--bg-sidebar)',
        'standard': 'var(--bg-standard)',
        'subtle': 'var(--bg-subtle)',
        'admonition': 'var(--admonition-bg)',
        'code': 'var(--code-bg)',
        'table-header': 'var(--table-header)',
      },
      textColor: {
        'body': 'var(--text-body)',
        'header': 'var(--text-header)',
        'dim': 'var(--text-dim)',
      },
      borderColor: {
        'light': 'var(--border-light)',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}
