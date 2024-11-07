const express = require("express");
const router = express.Router();
const GameBoard = require("../models/GameBoard");

// 게임 게시글 추가 API
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
    res.status(201).json(savedGamePost); 
  } catch (error) {
    res.status(500).json({ message: "게시글 저장 실패", error });
  }
});

// Todo /api/board -> /api/main 으로 변경
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gameBoard = await GameBoard.findById(id);

    if (!gameBoard) {
      return res.status(404).json({ message: "게임 게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(gameBoard);
  } catch (error) {
    res.status(500).json({ message: "게임 게시글 조회 실패", error });
  }
});

module.exports = router;
