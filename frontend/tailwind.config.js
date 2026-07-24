/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // "ink" — deep umber/espresso, like a worn leather map case or a
        // canvas expedition tent at dusk.
        ink: {
          DEFAULT: "#1A1410",
          800: "#221B15",
          700: "#2B2219",
          600: "#382C1F",
          500: "#4A3B29",
        },
        // "paper" — aged parchment/khaki map paper.
        paper: {
          DEFAULT: "#F1E6C8",
          dim: "#E0D0A0",
          line: "#7A6642",
        },
        // "brass" — burnished compass-brass gold.
        brass: {
          DEFAULT: "#C88A3B",
          light: "#E8AD5E",
          dark: "#8F5E22",
        },
        // "coral" — rust/terracotta, like an old expedition stamp or a
        // sunburnt trail marker.
        coral: {
          DEFAULT: "#B0432A",
          light: "#D0654A",
          dark: "#7A2C1B",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(241,230,200,0.06) 1px, transparent 0)",
        "vignette": "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)",
        "gold-sheen": "linear-gradient(120deg, rgba(200,138,59,0) 30%, rgba(232,173,94,0.2) 50%, rgba(200,138,59,0) 70%)",
      },
      boxShadow: {
        ticket: "0 22px 44px -20px rgba(0,0,0,0.55)",
        cinema: "0 30px 70px -25px rgba(0,0,0,0.65)",
      },
      borderRadius: {
        stub: "14px",
      },
    },
  },
  plugins: [],
};
