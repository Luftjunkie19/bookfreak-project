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
        "dark-blue-gradient": "linear-gradient(118.471deg, rgba(39, 39, 39, 40%) 0%, rgba(71, 119, 255, 40%) 100%)",
        "light-blue-gradient": "linear-gradient(115.653deg, #4777FF 0%, #FCFCFC 100%)",
        "dark-white-gradient": 'linear-gradient(119.609deg, #272727 0%, #FCFCFC 100%)',
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
      width: {
        clubLogo: "48px",
      },
      maxWidth: {
        clubLogo: "48px",
      },
    },
  },
  darkMode: "class",
  plugins: [require("daisyui"), nextui()],
 
  important: true,
});
