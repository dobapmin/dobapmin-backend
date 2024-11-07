// const express = require("express");
// const router = express.Router();
// const GameBoard = require("../models/GameBoard"); // GameBoard 모델의 경로에 맞게 수정

// // GameBoard 게시글 추가 API
// router.post("/", async (req, res) => {
//   try {
//     const { name, title, content, winner, isEnd, totalCount, currentCount, participate } = req.body;

//     const newGamePost = new GameBoard({
//       name,
//       title,
//       content,
//       winner,
//       participate: participate || [], // 기본값으로 빈 배열 설정
//       isEnd,
//       totalCount,
//       currentCount,
//     });

//     const savedGamePost = await newGamePost.save();
//     res.status(201).json(savedGamePost); // 저장된 전체 객체를 응답으로 반환
//   } catch (error) {
//     res.status(500).json({ message: "게시글 저장 실패", error });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const GameBoard = require("../models/GameBoard"); // GameBoard 모델의 경로에 맞게 수정

// GameBoard 게시글 추가 API
router.post("/", async (req, res) => {
  try {
    const { title, content, totalCount } = req.body;

    const newGamePost = new GameBoard({
      // name: req.cookies.name, // 이름 쿠키에서 받으면
      name: "임시 이름",
      title,
      content,
      winner: "-", // 초기값 "-"
      // participate: [req.cookies.name], // 이름 쿠키에서 넘겨 받으면
      participate: ["임시 이름"],
      isEnd: false,
      totalCount,
      currentCount: 1,
    });

    const savedGamePost = await newGamePost.save();
    res.status(201).json(savedGamePost); // 저장된 전체 객체를 응답으로 반환
  } catch (error) {
    res.status(500).json({ message: "게시글 저장 실패", error });
  }
});

module.exports = router;
