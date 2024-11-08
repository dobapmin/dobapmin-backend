const express = require("express");
const router = express.Router();
const Board = require("../models/Board");

// 게시글 추가 API
router.post("/", async (req, res) => {
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
  console.log("party req", req.body);
  try {
    const { boardId } = req.params;
    const userName = req.body.name;
    console.log(req.body);
    const board = await Board.findById(boardId);

    if (!board)
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    // 이미 마감된 게시글인지 확인
    if (board.isEnd) {
      return res.status(400).json({ message: "참여가 마감된 게시글입니다." });
    }

    // 현재 사용자가 이미 참여한 사용자인지 확인
    const isAlreadyParticipated = board.participate.some(
      (participant) => participant === userName
    );
    if (isAlreadyParticipated) {
      return res.status(400).json({ message: "이미 참여한 사용자입니다." });
    }

    // 참여 처리
    board.participate.push(userName);
    board.currentCount += 1;

    // 최대 인원에 도달 시 마감 상태로 변경
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
    const userName = req.body.name; // 참여자의 이름을 요청 본문에서 가져오기
    const board = await Board.findById(boardId);

    if (!board)
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    // 참여자 목록에 사용자가 포함되어 있는지 확인
    const isParticipant = board.participate.includes(userName);
    if (!isParticipant) {
      return res.status(400).json({ message: "참여하지 않은 사용자입니다." });
    }

    // 참여 취소 처리
    board.participate = board.participate.filter(
      (participant) => participant !== userName
    );
    board.currentCount -= 1;
    board.isEnd = false; // 마감 상태 해제

    await board.save();
    res.status(200).json({ message: "참여가 취소되었습니다.", board });
  } catch (error) {
    res.status(500).json({ message: "참여 취소 처리 중 오류 발생", error });
  }
});

module.exports = router;
