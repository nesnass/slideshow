module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: ["./public/**/*.html", "./src/**/*.vue"],
  theme: {
    extend: {},
    colors: {
      indigo: "#5c6ac4",
      blue: "#007ace",
      blue75: "rgba(0,122,206,0.75)",
      blue25: "rgba(0,122,206,0.25)",
      red: "#de3618",
      white: "#fff",
      cyan: "#00ffff",
      goldenrod: "#daa520"
    }
  },
  variants: {},
  plugins: []
};
