import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#89511a",
          container: "#db9558",
          fixed: "#ffdcc2",
          "fixed-dim": "#ffb77b",
        },
        secondary: {
          DEFAULT: "#54643c",
          container: "#d4e6b4",
          "fixed-dim": "#bbcd9c",
          "on-container": "#58683f",
        },
        tertiary: {
          DEFAULT: "#52634f",
          container: "#97aa93",
          fixed: "#d4e8ce",
          "fixed-dim": "#b9ccb3",
        },
        surface: {
          DEFAULT: "#f1fcf3",
          cream: "#FCF9EA",
          pure: "#FFFFFF",
          container: "#e5f1e7",
          "container-low": "#ebf7ed",
          "container-high": "#e0ebe2",
          "container-lowest": "#ffffff",
        },
        "botanical-muted": "#E5ECE0",
        "amber-subtle": "#F6E4D3",
        "on-surface": "#141e18",
        "on-surface-variant": "#52443a",
        "inverse-surface": "#29332c",
        "inverse-on-surface": "#e8f4ea",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      maxWidth: {
        container: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
