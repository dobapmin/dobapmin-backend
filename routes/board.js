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

module.exports = router;
