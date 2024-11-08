const mongoose = require("mongoose");
const moment = require("moment-timezone");

const gameBoardSchema = new mongoose.Schema({
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
  winner: {
    type: String,
    default: null,
  },
  createdAt: {
    type: String,
    default: () => moment().tz("Asia/Seoul").format("YYYY.MM.DD"),
  },
  isEnd: {
    type: Boolean,
    required: true,
  },
  participate: {
    type: [String], // 참여자 리스트
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

// 새 문서가 저장될 때 자동으로 createdAt을 한국 시간으로 포맷하여 저장
gameBoardSchema.pre("save", function (next) {
  this.createdAt = moment().tz("Asia/Seoul").format("YYYY.MM.DD");
  next();
});

const GameBoard = mongoose.model("gameboard", gameBoardSchema);
module.exports = GameBoard;
