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

// 게임 게시글 상세 조회 API
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

// 내기 참여하기 API
router.post("/party/:gameBoardId", async (req, res) => {
  try {
    const { gameBoardId } = req.params;
    const gameBoard = await GameBoard.findById(gameBoardId);

    if (!gameBoard) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    if (gameBoard.currentCount >= gameBoard.totalCount) {
      return res.status(400).json({ message: "참여가 마감되었습니다." });
    }

    gameBoard.currentCount += 1;
    if (gameBoard.currentCount === gameBoard.totalCount) {
      gameBoard.isEnd = true;
    }

    await gameBoard.save();
    res.status(200).json({ message: "참여가 완료되었습니다.", gameBoard });
  } catch (error) {
    res.status(500).json({ message: "참여 처리 중 오류 발생", error });
  }
});

// 내기 참여취소 API
router.delete("/party/:gameBoardId", async (req, res) => {
  try {
    const { gameBoardId } = req.params;
    const gameBoard = await GameBoard.findById(gameBoardId);

    if (!gameBoard) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    if (gameBoard.currentCount > 0) {
      gameBoard.currentCount -= 1;
      gameBoard.isEnd = false;
      await gameBoard.save();
      res.status(200).json({ message: "참여가 취소되었습니다.", gameBoard });
    } else {
      res.status(400).json({ message: "참여자가 없습니다." });
    }
  } catch (error) {
    res.status(500).json({ message: "참여 취소 처리 중 오류 발생", error });
  }
});

module.exports = router;
