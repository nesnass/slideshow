/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const port = process.env.VUE_APP_PORT
const host = process.env.VUE_APP_HOST
const hotport = process.env.VUE_APP_HOT_PORT
const hothost = process.env.VUE_APP_HOT_HOST
const httpsKey = fs.readFileSync(process.env.SSL_KEY_FILE)
const httpsCert = fs.readFileSync(process.env.SSL_CERT_FILE)

module.exports = {
  // outputDir: path.resolve(__dirname, "./public/app")
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      const tmp = args[0]
      tmp.template = 'src/index.html'
      tmp.favicon = 'src/assets/favicon-32x32.png'
      return args
    })
  },
  devServer: {
    https: {
      key: httpsKey,
      cert: httpsCert,
    },
    host: hothost,
    port: hotport,
    index: 'index.html',
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      '/': {
        target: `${host}:${port}`,
        changeOrigin: true,
      },
    },
  },
}
