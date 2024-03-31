/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { colors: { pry: { 2: "#6096ba" }, beige: { 1: "#9e0059" } } ,boxShadow: {config: '0px 4px 4px 0px #00000040'}},
  },
  plugins: [],
};
