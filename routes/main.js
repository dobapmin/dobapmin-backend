const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const GameBoard = require('../models/GameBoard');

router.get('/', async (req, res) => {
  try {
    const boards = await Board.find();
    const gameBoards = await GameBoard.find();

    res.status(200).json({
      boards,
      gameBoards,
    });
  } catch (error) {
    res.status(500).json({ message: '데이터 조회 실패', error });
  }
});

module.exports = router;
