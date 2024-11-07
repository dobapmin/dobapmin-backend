const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
//   board_id: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
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
  category: {
    type: String,
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    required: true,
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

const Board = mongoose.model("board", boardSchema);
module.exports = Board;