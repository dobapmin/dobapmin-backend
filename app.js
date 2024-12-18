var createError = require("http-errors");
const session = require("express-session");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var boardRouter = require("./routes/board");
var gameBoardRouter = require("./routes/gameBoard");
var mainRouter = require("./routes/main");
var app = express();
const mongoose = require("./db");
const cors = require("cors");

require("./utils/scheduler");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "<my-secret>",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, //https만 가능
    },
  })
);

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/", indexRouter);
app.use("/api", userRouter);
app.use("/api/board", boardRouter);
app.use("/api/gameBoard", gameBoardRouter);
app.use("/api/main", mainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json("error");
});

module.exports = app;
