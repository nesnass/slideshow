require("dotenv").config();
const exiftool = require("node-exiftool");
const ep = new exiftool.ExiftoolProcess();
const express = require("express");
const router = express.Router();

const path = require("path");
const app = express();
const imagePath = path.join(process.env.SLIDESHOW_ROOT);
const collections = ["vietnam", "norway"];

router.get("/collections", function(req, res) {
  res.json(collections);
});

router.get("/listing", function(req, res, next) {
  const dir = req.query.collection;
  if (collections.indexOf(dir) < 0) return next();
  ep.open()
    .then(() => {
      return ep.readMetadata(`${imagePath}/${dir}`, ["-ext mov", "n"]); // Exclude 'mov' files..
    })
    .then((result, error) => {
      ep.close()
      if (result && result.data) {
        const data = result.data.map((d) => {
          delete d.SourceFile
          delete d.Directory
          return d
        })
        return res.json(data);
      }
      if (error) return res.error(error);
      return res.json([]);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
    });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://localhost:8080"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Range"
  );
  next();
});
app.options("*", (req, res) => {
  res.json({
    status: "OK",
  });
});

app.use("/images", express.static(process.env.SLIDESHOW_ROOT));
app.use(express.static("dist"));
app.use(router);

module.exports = app;
