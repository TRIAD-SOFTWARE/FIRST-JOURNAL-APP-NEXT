/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        'book-pattern': "url('./img/book-pattern.jpg')",
      },
      colors: {
        'custom-purple': '#D0A2F7',
        'custom-dark': '#704264',
      },
    },
  },
  plugins: [],
}

