/*
 Designed and developed by Richard Nesnass
*/
const https = require("https");
const fs = require("fs");
const app = require("./app");
const port = process.env.VUE_APP_PORT;

function startServerCallback() {
  console.log(
    `Your server is listening at ${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`
  );
}

// Activate HTTPS server or HTTP server if running locally
const SSLkey = fs.readFileSync(process.env.SSL_KEY_FILE);
let SSLcert = fs.readFileSync(process.env.SSL_CERT_FILE);
if (process.env.NODE_ENV == "production") {
  const SSLchain = fs.readFileSync(process.env.SSL_CHAIN_FILE);
  SSLcert = SSLcert + SSLchain;
}
const sslOptions = {
  key: SSLkey,
  cert: SSLcert,
  ca: null
};
https.createServer(sslOptions, app).listen(port, startServerCallback);
