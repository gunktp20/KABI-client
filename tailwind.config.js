/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: { 
        min: "0px",
       max: "600px" },

      md: { 
        min: "601px", 
        max: "1023px" },

      lg: { 
        min: "1024px", 
        max: "1279px" },

      xl: { 
        min: "1280px", 
        max: "1535px" },
      "2xl":{
        min:"1535",
        max:"3150px"
      }

    },
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'primary': {
         50: '#e6f3fa',
        100: '#b0d9f0',
        200: '#8ac7e8',
        300: '#54aede',
        400: '#339ed7',
        500: '#0086cd',
        600: '#007abb',
        700: '#005f92',
        800: '#004a71',
        900: '#003856',
      },
      'gray':{
         50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#030712',
      }
    }
  },
  plugins: [],
}