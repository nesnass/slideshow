const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const app = express();
const imagePath = path.join(path.resolve(__dirname), "/collections");
const collections = ["vietnam"];
const port = 3000;

function getListing(req, res, next) {
  const dir = req.query.collection;
  if (collections.indexOf(dir) < 0) return next();
  fs.readdir(`${imagePath}/${dir}`, function(err, images) {
    if (err) {
      return next(err);
    }
    const regex = RegExp(/.jpg|.png/);
    res.locals.filenames = images.filter(i => regex.test(i));
    fs.readFile(`${imagePath}/${dir}/captions.json`, function(err, captions) {
      if (err) {
        return next(err);
      }
      const c = JSON.parse(captions);
      res.locals.captions = c;
      next();
    });
  });
}

router.get("/collections", function(req, res) {
  res.json(collections);
});

router.get("/listing", getListing, function(req, res) {
  // build a response using res.locals.filenames here.
  // just sending the names is silly, and so for demonstration only
  res.json({ images: res.locals.filenames, captions: res.locals.captions });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/images", express.static("collections"));
app.use(express.static("dist"));
app.use(router);
app.listen(port, () => {
  console.log(`Slideshow server listening at http://localhost:${port}`);
});

module.exports = router;