/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx,.css}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-blue-700",
    "text-cyan-400",
    "text-green-700",
    "text-lime-500",
    "text-red-800 ",
    "text-yellow-500" /*  Hextech Magic */,
    "blue-1",
    "blue-2",
    "blue-3",
    "blue-4",
    "blue-5",
    "blue-6",
    "blue-7",
    /*  Hextech Metal */
    "gold-1",
    "gold-2",
    "gold-3",
    "gold-4",
    "gold-5",
    "gold-6",
    "gold-7",
    /*  Gray - For Text/background/inactive states  */
    "grey-1",
    "grey-1.5",
    "grey-2",
    "grey-3",
    "grey-cool",
    "hextech-black",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-spiegel)"],
        beaufort: ["var(--font-beaufort)"],
        spiegel: ["var(--font-spiegel)"],
      },
      colors: {
        /*  Hextech Magic */
        "blue-1": "#CDFAFA",
        "blue-2": "#0AC8B9",
        "blue-3": "#0397AB",
        "blue-4": "#005A82",
        "blue-5": "#0A323C",
        "blue-6": "#091428",
        "blue-7": "#0A1428",
        /*  Hextech Metal */
        "gold-1": "#F0E6D2",
        "gold-2": "#C8AA6E",
        "gold-3": "#C8AA6E",
        "gold-4": "#C89B3C",
        "gold-5": "#785A28",
        "gold-6": "#463714",
        "gold-7": "#32281E",
        /*  Gray - For Text/background/inactive states  */
        "grey-1": "#A09B8C",
        "grey-1.5": "#5B5A56",
        "grey-2": "#3C3C41",
        "grey-3": "#1E2328",
        "grey-cool": "#1E282D",
        "hextech-black": "#010A13",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
