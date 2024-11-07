const mongoose = require("mongoose");

// 날짜를 yyyy.mm.dd 형식으로 포맷하는 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

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
    // type: Date,
    // default: Date.now,
    type: String,
    default: () => formatDate(new Date()), // 현재 날짜를 yyyy.mm.dd 형식으로 저장
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