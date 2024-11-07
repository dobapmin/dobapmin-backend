var express = require("express");
var router = express.Router();
let User2 = require("../models/User2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("user2");
});

router.post("/", function (req, res, next) {});

module.exports = router;
