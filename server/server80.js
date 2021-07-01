/*
 Designed and developed by Richard Nesnass
*/
const http = require("http");
const app = require("./app");
const port = process.env.VUE_APP_PORT;

function startServerCallback() {
  console.log(
    `Your server is listening at ${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`
  );
}

http.createServer(app).listen(port, startServerCallback);
