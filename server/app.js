require("dotenv").config();
const exiftool = require("node-exiftool");
const ep = new exiftool.ExiftoolProcess();
const express = require("express");
const session = require('express-session')
const cors = require('cors')
const MemoryStore = require('memorystore')(session)
const router = express.Router();

const path = require("path");
const app = express();
const imagePath = path.join(process.env.SLIDESHOW_ROOT);
const collections = process.env.COLLECTIONS.split(',');

function ensureAuthenticated(req, res, next) {
  if (req.method == 'OPTIONS') {
    return next()
  }
  if (!req.session || !req.session.login) {
    return res.status(403).end()
  }
  else return next()
}

app.locals.pretty = true
app.use(express.json())
app.use(express.static("dist"));

if (process.env.NODE_ENV === 'development') {
  let origin = ''
  app.use((req, res, next) => {
    const allowedOrigins = [
      `${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`,
      `${process.env.VUE_APP_HOST}:8080`,
    ]
    let referer = req.headers.referer || req.headers.Referer
    if (referer) {
      if (referer.charAt(referer.length - 1) === '/') referer = referer.slice(0, -1)
      const i = allowedOrigins.indexOf(referer)
      if (i > -1) {
        origin = referer
        res.header('Access-Control-Allow-Origin', origin)
      }
    }
    res.header('Access-Control-Allow-Credentials', true)
    return next()
  })
  app.use(cors({ credentials: true, origin }))
}

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  rolling: true,
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 86400000, sameSite: 'none' },
}
app.set('trust proxy', 1) // trust first proxy
sessionOptions.proxy = true
sessionOptions.cookie.secure = true // serve secure cookies
app.use(session(sessionOptions))

router.get("/collections", ensureAuthenticated, function(req, res) {
  res.json(collections);
});

router.post("/login", function(req, res) {
  if (req.body.password === process.env.PASSWORD) {
    req.session.login = true
  } else req.session.login = false
  req.session.save()
  res.send({ login: req.session.login })
});

app.use('/images', ensureAuthenticated)
app.use("/images", express.static(process.env.SLIDESHOW_ROOT));

router.get("/listing", ensureAuthenticated, function(req, res, next) {
  const dir = req.query.collection;
  if (collections.indexOf(dir) < 0) return next();
  ep.open()
    .then(() => ep.readMetadata(`${imagePath}/${dir}`, ["-ext mov", "n"])) // Exclude 'mov' files..
    .then((result, error) => {
      ep.close()
      if (result && result.data) {
        const data = result.data.map((d) => {
          const tSplit = d.FileName.split('.')
          d.ThumbnailUrl = tSplit[0] + '_tn.jpeg'
          delete d.SourceFile
          delete d.Directory
          return d
        })
        return res.json(data);
      }
      if (error) return res.error(error);
      return res.send("No result");
    })
    .catch((error) => {
      ep.close()
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

app.use(router);

module.exports = app;
