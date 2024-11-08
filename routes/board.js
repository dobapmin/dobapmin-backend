const express = require("express");
const router = express.Router();
const Board = require("../models/Board");

// 게시글 추가 API
router.post("/", async (req, res) => {
  try {
    const { name, title, content, category, isAnonymous, isEnd, participate, totalCount, currentCount } = req.body;

    const newPost = new Board({
      name,
      title,
      content,
      category,
      isAnonymous,
      isEnd,
      participate: participate || [],
      totalCount,
      currentCount,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "게시글 저장 실패", error });
  }
});

// 게시글 상세 조회 API
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    }

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: "글 조회 실패", error });
  }
});

// 밥 참여하기 API
router.post("/party/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    if (board.currentCount >= board.totalCount) {
      return res.status(400).json({ message: "참여가 마감되었습니다." });
    }

    board.currentCount += 1;
    if (board.currentCount === board.totalCount) {
      board.isEnd = true;
    }

    await board.save();
    res.status(200).json({ message: "참여가 완료되었습니다.", board });
  } catch (error) {
    res.status(500).json({ message: "참여 처리 중 오류 발생", error });
  }
});

// 밥 참여취소 API
router.delete("/party/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    if (board.currentCount > 0) {
      board.currentCount -= 1;
      board.isEnd = false;
      await board.save();
      res.status(200).json({ message: "참여가 취소되었습니다.", board });
    } else {
      res.status(400).json({ message: "참여자가 없습니다." });
    }
  } catch (error) {
    res.status(500).json({ message: "참여 취소 처리 중 오류 발생", error });
  }
});

module.exports = router;
