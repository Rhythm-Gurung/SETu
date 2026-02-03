/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
    // Gym-style palette using the existing olive-* tokens
    // for primary accent and dark surfaces
    'blue-dark': '#0EA5E9', // primary accent (buttons, links)
    'blue-medium': '#38BDF8', // lighter accent
    'blue-light': '#1F2937', // borders / subtle outlines
    'blue-lighter': '#111827', // card background
    'blue-lightest': '#020617', // app background 
    // Custom greys used throughout auth screens
    'gray-650': '#9CA3AF',
    'gray-550': '#6B7280',
    'grey-650': '#9CA3AF',
    'grey-500': '#6B7280',
      },
    },
  },
  plugins: [],
}