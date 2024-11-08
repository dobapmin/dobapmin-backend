const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// 게시글 추가 API
router.post('/', async (req, res) => {
  try {
    const userName = req.cookies["dobapmin-Token"];
    const name = userName || "쿠유없";

    const {
      title,
      content,
      category,
      isAnonymous,
      totalCount,
    } = req.body;


    const newPost = new Board({
      name,
      title,
      content,
      category,
      isAnonymous,
      isEnd: false,
      participate: [userName],
      totalCount,
      currentCount: 1,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: '게시글 저장 실패', error });
  }
});

module.exports = router;
