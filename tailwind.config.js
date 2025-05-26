/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sign: ["Dancing Script", "cursive"],
      bdlHeading: ["bdlHeading", "sans-serif"],
    },
    extend: {
      dropShadow: {
        custom: "0px 0px 11px #000000",
      },
      textShadow: {
        custom: "0px 0px 3px rgba(255,255,255,0.74)", // Uncommented
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari, and Opera */,
        },
        ".clip-custom-shape": {
          clipPath:
            "polygon(78% 13.5%, 70.4% 29.3%, 70.4% 50%, 67.4% 68.3%, 72.3% 86.8%, 68.1% 100%, 0% 100%, 0% 0%, 78.1% 0%)",
        },
      });
    },
  ],
};
