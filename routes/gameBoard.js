// const express = require("express");
// const router = express.Router();
// const GameBoard = require("../models/GameBoard"); // GameBoard 모델의 경로에 맞게 수정

// // GameBoard 게시글 추가 API
// router.post("/", async (req, res) => {
//   try {
//     const { name, title, content, winner, isEnd, totalCount, currentCount, participate } = req.body;

//     const newGamePost = new GameBoard({
//       name,
//       title,
//       content,
//       winner,
//       participate: participate || [], // 기본값으로 빈 배열 설정
//       isEnd,
//       totalCount,
//       currentCount,
//     });

//     const savedGamePost = await newGamePost.save();
//     res.status(201).json(savedGamePost); // 저장된 전체 객체를 응답으로 반환
//   } catch (error) {
//     res.status(500).json({ message: "게시글 저장 실패", error });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const GameBoard = require("../models/GameBoard");

// 게임 게시글 추가 API
router.post("/", async (req, res) => {
  try {
    const userName = req.cookies["dobapmin-Token"];
    const name = userName || "쿠유없";

    const { title, content, totalCount } = req.body;

    const newGamePost = new GameBoard({
      name,
      title,
      content,
      winner: "",
      participate: [name],
      isEnd: false,
      totalCount,
      currentCount: 1,
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
      return res
        .status(404)
        .json({ message: "게임 게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(gameBoard);
  } catch (error) {
    res.status(500).json({ message: "게임 게시글 조회 실패", error });
  }
});

// 내기 참여하기 API
router.post("/party/:gameBoardId", async (req, res) => {
  const userName = req.body.name;
  try {
    const { gameBoardId } = req.params;
    const gameBoard = await GameBoard.findById(gameBoardId);

    if (!gameBoard)
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    if (gameBoard.currentCount >= gameBoard.totalCount) {
      return res.status(400).json({ message: "참여가 마감되었습니다." });
    }
    gameBoard.participate.push(userName);
    gameBoard.currentCount += 1;
    // 참여자가 다 찼다고 gameBoard.isEnd를 true로 주면 뽑기 화면이 출력돼버림
    // if (gameBoard.currentCount === gameBoard.totalCount) {
    //   gameBoard.isEnd = true;
    // }

    await gameBoard.save();
    res.status(200).json({ message: "참여가 완료되었습니다.", gameBoard });
  } catch (error) {
    res.status(500).json({ message: "참여 처리 중 오류 발생", error });
  }
});

// // 내기 참여취소 API
// router.delete("/party/:gameBoardId", async (req, res) => {
//   try {
//     const { gameBoardId } = req.params;
//     const gameBoard = await GameBoard.findById(gameBoardId);

//     if (!gameBoard)
//       return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

//     if (gameBoard.currentCount > 0) {
//       gameBoard.currentCount -= 1;
//       gameBoard.isEnd = false;
//       await gameBoard.save();
//       res.status(200).json({ message: "참여가 취소되었습니다.", gameBoard });
//     } else {
//       res.status(400).json({ message: "참여자가 없습니다." });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "참여 취소 처리 중 오류 발생", error });
//   }
// });

// 내기 참여취소 API
router.delete("/party/:gameBoardId", async (req, res) => {
  try {
    const { gameBoardId } = req.params;
    const userName = req.body.name; // 참여자의 이름을 요청 본문에서 가져오기
    console.log(req.body);
    const gameBoard = await GameBoard.findById(gameBoardId);

    if (!gameBoard)
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    // 참여자 목록에 사용자가 포함되어 있는지 확인
    const isParticipant = gameBoard.participate.includes(userName);
    if (!isParticipant) {
      return res.status(400).json({ message: "참여하지 않은 사용자입니다." });
    }

    // 참여 취소 처리
    gameBoard.participate = gameBoard.participate.filter(
      (participant) => participant !== userName
    );
    gameBoard.currentCount -= 1;
    gameBoard.isEnd = false; // 마감 상태 해제

    await gameBoard.save();
    res.status(200).json({ message: "참여가 취소되었습니다.", gameBoard });
  } catch (error) {
    res.status(500).json({ message: "참여 취소 처리 중 오류 발생", error });
  }

  //   if (gameBoard.currentCount > 0) {
  //     gameBoard.currentCount -= 1;
  //     gameBoard.isEnd = false;
  //     await gameBoard.save();
  //     res.status(200).json({ message: "참여가 취소되었습니다.", gameBoard });
  //   } else {
  //     res.status(400).json({ message: "참여자가 없습니다." });
  //   }
  // } catch (error) {
  //   res.status(500).json({ message: "참여 취소 처리 중 오류 발생", error });
  // }
});

// 뽑기 시작 API
router.post("/select/:gameBoardId", async (req, res) => {
  try {
    const { gameBoardId } = req.params;
    const userName = req.body.name; 
    const gameBoard = await GameBoard.findById(gameBoardId);

    if (!gameBoard) {
      return res
        .status(404)
        .json({ message: "게임 게시글을 찾을 수 없습니다." });
    }

    // 요청을 보낸 사용자가 게시글 작성자인지 확인
    if (gameBoard.name !== userName) { 
      return res.status(403).json({ message: "작성자만 뽑기를 시작할 수 있습니다." });
    }

    // 이미 종료된 경우
    if (gameBoard.isEnd) {
      return res.status(400).json({ message: "이미 마감된 게시글입니다." });
    }

    // 참여자 배열이 비어 있는 경우
    if (gameBoard.participate.length === 0) {
      return res.status(400).json({ message: "참여자가 없습니다." });
    }

    // 랜덤으로 참여자 중에서 winner 선정
    const randomIndex = Math.floor(
      Math.random() * gameBoard.participate.length
    );
    gameBoard.winner = gameBoard.participate[randomIndex];
    gameBoard.isEnd = true; // 마감 상태로 변경

    await gameBoard.save();
    res.status(200).json({ message: "뽑기가 완료되었습니다.", gameBoard });
  } catch (error) {
    res.status(500).json({ message: "뽑기 처리 중 오류 발생", error });
  }
});


module.exports = router;
