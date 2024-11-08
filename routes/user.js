var express = require("express");
var router = express.Router();
let User = require("../models/User");
const { createToken, verifyToken } = require("../utils/auth.js");

/* GET users listing. */
router.get("/user", function (req, res, next) {
  User.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => next(err));
});

router.post("/user", function (req, res, next) {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

router.post("/login", async function (req, res, next) {
  try {
    const { nickname } = req.body;
    const user = await User.login(nickname);

    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = user.name;
    console.log("token", token);
    // user.token = token;
    res.cookie("dobapmin-Token", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });
    res.send(user);
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

router.post("/logout", (req, res) => {
  // 'dobapmin-Token' 쿠키 삭제
  res.clearCookie("dobapmin-Token", {
    httpOnly: true,
    sameSite: "Lax", // 'None' 및 'secure: true'로 변경 가능 (배포 시)
    secure: false, // 개발 환경에서는 false, 프로덕션에서는 true로 설정
  });

  // 로그아웃 성공 응답
  res.send("로그아웃 성공");
});

module.exports = router;
