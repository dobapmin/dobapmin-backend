const mongoose = require("mongoose");

const gameBoardSchema = new mongoose.Schema({
  // game_board_id: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  // },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  winner: {
    type: String,
    required: true,
  },
  participate: {
    type: [String], // 참여자 리스트
  },
  isEnd: {
    type: Boolean,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  currentCount: {
    type: Number,
    required: true,
  },
});

const GameBoard = mongoose.model("gameBoard", gameBoardSchema);
module.exports = GameBoard;