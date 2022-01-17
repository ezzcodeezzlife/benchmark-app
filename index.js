var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var pug = require("pug");
const mongoose = require("mongoose");
var dbBench = require("./user_model.js");
const axios = require("axios");
require("dotenv").config();

const uri = process.env.MONGOSTRING;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

const port = 5000;
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (req, res, next) {
  var dataa = await dbBench.find({}).exec(); //find all entrys
  res.render("index", {
    data: JSON.stringify(dataa),
  });
});

app.get("/add", async function (req, res, next) {
  var dataa = await dbBench.find({}).exec(); //find all entrys
  res.render("add", {
    data: JSON.stringify(dataa),
  });
});

app.post("/add", async function (req, res, next) {
  console.log(req.body.lat);
  console.log(req.body.long);
  console.log(req.body.beschreibung);
  console.log(req.body.nickname);

  if (req.body.nickname == "") {
    req.body.nickname = "unknown";
  }
  dbBench.create({
    lat: req.body.lat,
    long: req.body.long,
    beschreibung: req.body.beschreibung,
    nickname: req.body.nickname,
  });
  console.log("Successful creation of new entry");

  res.render("thanks");
});

app.get("/leaderboard", async function (req, res, next) {
  var all = await dbBench.aggregate([
    {
      $group: {
        _id: "$nickname",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
  console.log(all);

  res.render("leaderboard", {
    tabledata: all,
  });
});

app.get("/fullscreenmap", async function (req, res, next) {
  var dataa = await dbBench.find({}).exec(); //find all entrys
  res.render("fullscreenmap", {
    data: JSON.stringify(dataa),
  });
});

app.get("/:id", function (req, res, next) {
  console.log(req.params.id);
  res.render("singlebench", {
    id: req.params.id,
  });
});

app.get("/profile/:id", async function (req, res, next) {
  var all = await dbBench.find({
    nickname: req.params.id,
  });
  console.log(all);

  res.render("profile", {
    tabledata: all,
    nickname: req.params.id,
    datajson: JSON.stringify(all),
  });
});

app.get("/singleinfo/:id", async function (req, res, next) {
  let endpoint =
    "https://overpass.openstreetmap.fr/api/interpreter?data=[out:json]; (node(" +
    req.params.id +
    ");); (._;>;); out;";
  axios
    .get(endpoint)
    .then((response) => {
      console.log(response.data);
      res.send(response.data);
      //console.log(response.data.explanation);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening at http://localhost:${port}`);
});
