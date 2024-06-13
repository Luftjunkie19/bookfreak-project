/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
const withMT = require("@material-tailwind/react/utils/withMT");


module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{html,jsx,js}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    screens: {
      sm: "0px",
      md: "481px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1560px",
    },
    extend: {
      colors: {
        'primary-color': "#4777FF",
        'secondary-color': "#272727", 
        "dark-gray": '#2E2D2D',
        'bg-color': "#800000",
        imgCover: "rgba(0, 0, 0, 0.55)",
        userColumnBgCol: "rgba(0, 0, 0,0.15)",
        spotify: "#1DB954",
        discord: "#424549",
        youtube: "#FF0000",
        facebook: "#4267B2",
        github: "#333",
        lightModeCol: "#F5F5F5",
        modalAccColor: "rgba(66, 103, 181, 0.95)",
        modalPrimeColor: "rgba(26,35,57,0.95)",
      },
    },
  },
  
  plugins: [require("daisyui"), nextui()],
 
  important: true,
});
