const express = require("express");
const router = express.Router();
const GameBoard = require("../models/GameBoard");

router.post("/", async (req, res) => {
  try {
    const { name, title, content, winner, isEnd, totalCount, currentCount, participate } = req.body;

    const newGamePost = new GameBoard({
      name,
      title,
      content,
      winner,
      participate: participate || [],
      isEnd,
      totalCount,
      currentCount,
    });

    const savedGamePost = await newGamePost.save();
    res.status(201).json(savedGamePost); // 저장된 전체 객체를 응답으로 반환
  } catch (error) {
    res.status(500).json({ message: "게시글 저장 실패", error });
  }
});

module.exports = router;
