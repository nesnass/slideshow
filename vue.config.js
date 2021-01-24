// const path = require("path");
const port = process.env.VUE_APP_PORT;
const host = process.env.VUE_APP_HOST;
const hotport = process.env.VUE_APP_HOT_PORT;
const hothost = process.env.VUE_APP_HOT_HOST;

module.exports = {
  // outputDir: path.resolve(__dirname, "./public/app")
  devServer: {
    host: hothost,
    port: hotport,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      "/": {
        target: `${host}:${port}`,
        changeOrigin: true
      }
    }
  }
};
