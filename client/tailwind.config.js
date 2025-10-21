// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1c1c1e",
        "dark-card": "#2c2c2e",
        "dark-text": "#f2f2f7",
        "dark-subtle": "#3a3a3c",
        "dark-border": "#48484a",
        "dark-primary": "#0a84ff",
      },
    },
  },
  plugins: [],
};
