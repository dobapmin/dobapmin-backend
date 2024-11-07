var express = require("express");
var router = express.Router();
let User = require("../models/User");
const { createToken, verifyToken } = require("../utils/auth.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  User.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => next(err));
});

router.post("/", function (req, res, next) {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

router.post("/login", async function (req, res, next) {
  try {
    const { nickname } = req.body;
    const user = await User.login(nickname);

    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = user.name + user.nickname;
    user.token = token;
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });
    res.send("login 성공");
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});
module.exports = router;
